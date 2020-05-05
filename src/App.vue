<template>
  <div id="q-app" class="rows full-width vh100">
    <div class="col-auto flex">
      <div style="margin:auto"></div>
      <div>{{sDockerDaemonUser}}</div>
    </div>
    <div class="col flex">
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
