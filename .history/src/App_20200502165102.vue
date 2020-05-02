<template>
  <div id="q-app" class="row full-width vh100">
    <div class="col-auto">
      {{ sDockerDaemonUser }}
    </div>
    <div class="col row">
      <div class="col column vh100">

          <div class="col-auto row">
            <div class="col">
              <q-input dense filled v-model="sDockerHubSearchText" label="Search text..." @input="fnDebounceSearchResultsUpdate"/>
            </div>
            <div class="col-2">
              <q-btn flat icon="more_vert" class="full-width full-height">
                <q-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section @click="fnPullImage">Download</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="col">

            <q-virtual-scroll
              style=""
              :items="aDockerHubItems"
              separator
              class="full-height overflow-scroll"
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  dense
                >
                  <q-item-section>
                    <q-item-label class="word-break">
                      {{ item.name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>

          </div>

      </div>

      <div class="col column vh100">

          <div class="col-auto row">
            <div class="col">
              <q-input dense filled v-model="sDockerImagesFilterText" label="Filter images..." />
            </div>
            <div class="col-2">
              <q-btn flat icon="more_vert" class="full-width full-height">
                <q-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section>????</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="col">

            <q-virtual-scroll
              style=""
              :items="aDockerImages"
              separator
              class="full-height"
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  dense
                >
                  <q-item-section>
                    <q-item-label>
                      #{{ index }} - {{ item.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>

          </div>

      </div>
      <div class="col vh100">
        3
      </div>
    </div>
  </div>
</template>

<style>
html, body {
  height: 100vh;
}

.word-break {
  word-wrap: break-word;
  word-break: break-all;
}

.vh100 {
  height: 100vh;
}
</style>

<script>
import buildUrl from 'build-url';
const axios = require('axios');

const $log = console.log.bind(console);

class DockerSearch
{
  sSearchURL = 'https://hub.docker.com/api/content/v1/products/search'

  oParams = {
    page_size: 50,
    q: '',
    source: 'community',
    type: 'image'
  }

  constructor(oParams={})
  {
    this.fnSetParams(oParams);
    // '?page_size=100&q=%2B&source=community'
  }

  fnSetParams(oParams={})
  {
    this.oParams = {...this.oParams, ...oParams};
    return this;
  }

  toString()
  {
    return buildUrl(this.sSearchURL, { queryParams: this.oParams });
  }
}

class DockerAPI
{
  constructor()
  {
    this.oDockerSearch = new DockerSearch();
  }

  async fnSearch(sSearchString)
  {
    return new Promise((fnSuccess, fnFail) => {
      var sURL = this.oDockerSearch.fnSetParams({ q:sSearchString }).toString();

      axios
        .get(sURL)
        .then(function (response) {
          var aResult = [];

          if (response.data && response.data.summaries) {
            aResult = response.data.summaries;
          }

          $log(aResult);

          fnSuccess(aResult);
        })
        .catch(function (error) {
          fnFail(error);
        })
    });
  }
}

const { spawn } = require('child_process');

class SpawnCommand
{
  sCommand = ''
  sSpawnCommand = ''
  aSpawnArgs = []
  aStdOut = []
  aStdError = []
  bClosed = true
  iExitCode = -1;
  oSpawn = null

  constructor(sCommand)
  {
    var oThis = this;

    oThis.sCommand = sCommand
    var oMatch = oThis.sCommand.match(/\w+|".*?[^\\]"|'.*?[^\\]'/g)

    if (!oMatch) {
      throw new Error(`can't parse command '${sCommand}'`);
    }

    var aArr = Array.from(oMatch);
    oThis.sSpawnCommand = aArr.shift();
    oThis.aSpawnArgs = aArr;
  }

  fnPrepare(aParams)
  {
    var oThis = this;

    var aResult = oThis.aSpawnArgs;

    for (var sKey in aParams) {
      aResult = aResult.map((v) => v.replace(`%${sKey}%`, aParams[sKey]))
    }

    return aResult;
  }

  async fnRun(aParams={})
  {
    var oThis = this;

    return new Promise((fnSuccess, fnFail) => { 
      var aMapped = oThis.fnPrepare(aParams);

      oThis.oSpawn = spawn(oThis.sSpawnCommand, aMapped);

      oThis.bClosed = false;

      oThis.oSpawn.stdout.on('data', (data) => {
        oThis.aStdOut.push(data);
        // console.log(`stdout: ${data}`);
      });

      oThis.oSpawn.stderr.on('data', (data) => {
        oThis.aStdError.push(data);
        // console.error(`stderr: ${data}`);
      });

      oThis.oSpawn.on('close', (code) => {
        oThis.bClosed = false;
        oThis.iExitCode = code;
        fnSuccess(oThis.aStdOut, oThis.aStdError, oThis.iExitCode);
        // console.log(`child process exited with code ${code}`);
      });
    });
  }
}

var oDockerAPI = new DockerAPI();
var oDockerDaemonUser = new SpawnCommand(`ps aux | grep dockerd | awk '{ print $1; exit; }'`);

var aFuncs = [];
var fnD = (fn, iMillis) => {
  var iFound = aFuncs.findIndex((v) => v.fn == fn);
  if (~iFound) {
    clearTimeout(aFuncs[iFound].iTimeoutHandler);
    aFuncs.splice(iFound, 1);
  }
  aFuncs.push({
    fn,
    iMillis,
    iTimeoutHandler: setTimeout(fn, iMillis)
  });
}

export default {
  name: 'App',

  data()
  {
    return {
      sDockerHubSearchText: '',
      aDockerHubItems: [],
      sDockerImagesFilterText: '',
      aDockerImages: [],
      aDockerContainers: [],

      sDockerDaemonUser: ''
    }
  },

  computed: {
  },

  methods: {
    fnDebounceSearchResultsUpdate(sDockerHubSearchText)
    {
      var oThis = this;

      fnD(
        oThis.fnUpdateDockerHubList.bind(oThis),
        300
      );
    },

    fnPullImage()
    {
      
    },

    async fnUpdateDockerDaemonInfo()
    {
      var oThis = this;

      oThis.sDockerDaemonUser = await oDockerDaemonUser.fnRun();
    },

    async fnUpdateDockerHubList()
    {
      var oThis = this;

      oThis.aDockerHubItems = await oDockerAPI.fnSearch(oThis.sDockerHubSearchText);
    }
  },

  created()
  {
    var oThis = this;

    oThis.fnUpdateDockerDaemonInfo();

    oThis.fnUpdateDockerHubList();
  }
}
</script>
