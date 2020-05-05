<template>
  <div id="q-app" class="column rows full-width vh100">
    <!--div class="col-auto row">
      <div style="margin:auto"></div>
      <div class="q-pa-sm">dockerd user: <b>{{sDockerDaemonUser}}</b></div>
    </div-->
    <q-bar>
      <div class="cursor-pointer non-selectable">
        File
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable>
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top right" self="top left">
                <q-list>
                  <q-item
                    v-for="n in 3"
                    :key="n"
                    dense
                    clickable
                  >
                    <q-item-section>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top right" self="top left">
                      <q-list>
                        <q-item
                          v-for="n in 3"
                          :key="n"
                          dense
                          clickable
                        >
                          <q-item-section>3rd level Label</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <div class="q-ml-md cursor-pointer non-selectable">
        Edit
        <q-menu auto-close>
          <q-list dense style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Cut</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Copy</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Paste</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Select All</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <q-space />

      <!--q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" /-->

      <div class="q-pa-sm">dockerd user: <b>{{sDockerDaemonUser}}</b></div>
    </q-bar>

    <div class="col row">
      <div class="col column full-height">

          <div class="col-auto row">
            <div class="col">
              <q-input dense filled v-model="sDockerHubSearchText" label="Search text..." @input="fnDebounceSearchResultsUpdate">
                <template v-slot:append>
                  <q-spinner-bars
                    v-show="bDockerHubSearchTextShowLoader"
                    color="primary"
                    size="16px"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-1">
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
          <div class="col full-height">

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
                      <q-checkbox v-model="aDockerHubSelectedItems" :val="item.name" :label="item.name" color="primary" />                      
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>

          </div>

      </div>

      <div class="col column">

          <div class="col-auto row">
            <div class="col">
              <q-input dense filled v-model="sDockerImagesFilterText" label="Filter images..." />
            </div>
            <div class="col-1">
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
      <div class="col">
        
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
import { DockerWS } from './lib/docker-ws'

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

var oDockerWS = null;

export default {
  name: 'App',

  data()
  {
    return {
      sDockerHubSearchText: '',
      aDockerHubItems: [],
      aDockerHubSelectedItems: [],
      bDockerHubSearchTextShowLoader: false,
      sDockerImagesFilterText: '',
      aDockerImages: [],
      aDockerContainers: [],

      sDockerDaemonUser: ''
    }
  },

  computed: {
  },

  methods: {
    fnDebounceSearchResultsUpdate()
    {
      var oThis = this;

      oThis.bDockerHubSearchTextShowLoader = true;

      fnD(
        oThis.fnUpdateDockerHubList.bind(oThis),
        300
      );
    },

    fnPullSelectedImages()
    {

    },

    fnPullImage()
    {
      var oThis = this;

      if (oThis.sDockerDaemonUser == 'root') {
        // var {  } = await oDockerPullImage.fnRun({sImageName: }, true);
      }
    },

    async fnUpdateDockerDaemonInfo()
    {
      var oThis = this;

      oThis.sDockerDaemonUser = await oDockerWS.fnRun('oDockerDaemonUser.fnRun');
    },

    async fnUpdateDockerHubList()
    {
      var oThis = this;

      oThis.aDockerHubItems = await oDockerWS.fnRun('oDockerAPI.fnSearch', oThis.sDockerHubSearchText);
      oThis.bDockerHubSearchTextShowLoader = false;
    }
  },

  async mounted()
  {
    var oThis = this;

    oDockerWS = new DockerWS();

    await oThis.fnUpdateDockerDaemonInfo();
    await oThis.fnUpdateDockerHubList();
  },

  async created()
  {
    var oThis = this;
  }
}
</script>
