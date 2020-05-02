<template>
  <div id="q-app" class="row full-width vh100">
    <div class="col column vh100">

        <div class="col-1 row">
          <div class="col">
            <q-input dense filled v-model="sDockerHubSearchText" label="Search text..." @input="fnDebounceSearchResultsUpdate"/>
          </div>
          <div class="col-2">
            <q-btn flat icon="more_vert" class="full-width full-height">
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section @click="fnDownloadImage">Download</q-item-section>
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

    <div class="col vh100">
      <div class="column">
        <div class="col-1 row">
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
    </div>
    <div class="col vh100">
      3
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
    source: 'community'
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

var oDockerAPI = new DockerAPI();

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
    }
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

    fnDownloadImage()
    {
      
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

    oThis.fnUpdateDockerHubList();
  }
}
</script>
