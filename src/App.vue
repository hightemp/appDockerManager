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

      <template v-if="oDockerInfo">
        <div class="q-pa-sm">
          docker version: <b>{{oDockerInfo.sDockerVersion}}</b>
          dockerd user: <b>{{oDockerInfo.sDockerDaemonUser}}</b>
        </div>
      </template>
    </q-bar>

    <div class="col row">
      <div class="col column full-height">

          <div class="col-auto row">
            <div class="col">
              <q-input clearable dense filled v-model="sDockerHubSearchText" label="Search text..." @input="fnDebounceSearchResultsUpdate" :disable="bDockerHubListShowLoader">
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
          <div class="col full-height relative-position">

            <q-virtual-scroll
              style=""
              :items="aDockerHubItems"
              separator
              class="full-height overflow-scroll"
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  tag="label" 
                  v-ripple
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

            <q-inner-loading :showing="bDockerHubListShowLoader">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

          </div>

      </div>

      <div class="col column full-height">

          <div class="col-auto row">
            <div class="col">
              <q-input clearable dense filled v-model="sDockerImagesFilterText" label="Filter images..." @input="fnDebounceImagesListUpdate" :disable="bDockerImagesListShowLoader">
                <template v-slot:append>
                  <q-spinner-bars
                    v-show="bDockerImagesFilterTextShowLoader"
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
                      <q-item-section>????</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="col full-height relative-position">

            <q-virtual-scroll
              style=""
              :items="aDockerImages"
              separator
              class="full-height"
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  tag="label" 
                  v-ripple
                  dense
                >
                  <q-item-section side top>
                    <q-checkbox v-model="aDockerImagesSelectedItems" :val="item.ID" color="primary" /> 
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ item.Repository }}</q-item-label>
                    <q-item-label caption lines="2">
                      ID: {{ item.ID }}
                      Size: {{ item.Size }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{item.FormatedCreatedAt}}</q-item-label>
                    <!--q-icon name="star" color="yellow" /-->
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>

            <q-inner-loading :showing="bDockerImagesListShowLoader">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

          </div>

      </div>
      <div class="col column full-height">

          <div class="col-auto row">
            <div class="col">
              <q-input clearable dense filled v-model="sDockerContainersFilterText" label="Filter containers..." @input="fnDebounceContainersListUpdate" :disable="bDockerContainersListShowLoader">
                <template v-slot:append>
                  <q-spinner-bars
                    v-show="bDockerContainersFilterTextShowLoader"
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
                      <q-item-section>????</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="col full-height relative-position">

            <q-virtual-scroll
              style=""
              :items="aDockerContainers"
              separator
              class="full-height overflow-scroll"
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  tag="label"
                  class="word-break"
                  v-ripple
                  dense
                >
                  <q-item-section side top>
                    <q-checkbox v-model="aDockerContainersSelectedItems" :val="item.ID" color="primary" /> 
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="2">
                      {{ item.Names }}<br>
                      {{ item.Image }}
                    </q-item-label>
                    <q-item-label caption lines="4">
                      ID: {{ item.ID }}
                      Size: {{ item.Size }}<br>

                      <template v-if="item.Mounts">
                      Mounts: <b>{{ item.Mounts }}</b><br>
                      </template>

                      <template v-if="item.Networks">
                      Networks: <b>{{ item.Networks }}</b><br>
                      </template>

                      <template v-if="item.Ports">
                      Ports: <b>{{ item.Ports }}</b><br>
                      </template>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{item.FormatedCreatedAt}}</q-item-label>
                    <!--q-icon name="star" color="yellow" /-->
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>

            <q-inner-loading :showing="bDockerContainersListShowLoader">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

          </div>


      </div>
    </div>
  </div>
</template>

<style>
html, body {
  height: 100vh;
}

.word-break,
.word-break * {
  word-wrap: break-word;
  word-break: break-all;
}

.vh100 {
  height: 100vh;
}

.q-item--dense {
  padding: 0px;
}
</style>

<script>
import moment from 'moment'
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
      bDockerHubListShowLoader: true,

      sDockerImagesFilterText: '',
      aDockerImages: [],
      aDockerImagesSelectedItems: [],
      bDockerImagesFilterTextShowLoader: false,
      bDockerImagesListShowLoader: false,

      sDockerContainersFilterText: '',
      aDockerContainers: [],
      aDockerContainersSelectedItems: [],
      bDockerContainersFilterTextShowLoader: false,
      bDockerContainersListShowLoader: false,

      sDockerRunningContainersFilterText: '',
      aDockerRunningContainers: [],
      aDockerRunningContainersSelectedItems: [],
      bDockerRunningContainersFilterTextShowLoader: false,
      bDockerRunningContainersListShowLoader: false,

      oDockerInfo: null
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

    fnDebounceImagesListUpdate()
    {
      var oThis = this;

      oThis.bDockerImagesFilterTextShowLoader = true;

      fnD(
        oThis.fnUpdateDockerImagesList.bind(oThis),
        300
      );
    },

    fnDebounceContainersListUpdate()
    {
      var oThis = this;

      oThis.bDockerContainersFilterTextShowLoader = true;

      fnD(
        oThis.fnUpdateDockerContainersList.bind(oThis),
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

    async fnUpdateDockerImagesList()
    {
      var oThis = this;

      oThis.bDockerImagesFilterTextShowLoader = false;
      oThis.bDockerImagesListShowLoader = true;
      oThis.aDockerImages = await oDockerWS.fnRun('fnGetDockerImages');
      oThis.aDockerImages = oThis.aDockerImages.map((v) => {
        v.FormatedCreatedAt = moment(v.CreatedAt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return v;
      })
      if (oThis.sDockerImagesFilterText) {
        oThis.aDockerImages = oThis.aDockerImages.filter((v) => ~v.Repository.indexOf(oThis.sDockerImagesFilterText));
      }
      oThis.bDockerImagesListShowLoader = false;
    },

    async fnUpdateDockerContainersList()
    {
      var oThis = this;

      oThis.bDockerContainersFilterTextShowLoader = false;
      oThis.bDockerContainersListShowLoader = true;
      oThis.aDockerContainers = await oDockerWS.fnRun('fnGetDockerContainers');
      oThis.aDockerContainers = oThis.aDockerContainers.map((v) => {
        v.FormatedCreatedAt = moment(v.CreatedAt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return v;
      })
      if (oThis.sDockerContainersFilterText) {
        oThis.aDockerContainers = oThis.aDockerContainers.filter((v) => ~v.Image.indexOf(oThis.sDockerContainersFilterText));
      }
      oThis.bDockerContainersListShowLoader = false;
    },

    async fnUpdateDockerRunningContainersList()
    {
      var oThis = this;

      oThis.bDockerRunningContainersFilterTextShowLoader = false;
      oThis.bDockerRunningContainersListShowLoader = true;
      oThis.aDockerRunningContainers = await oDockerWS.fnRun('fnGetDockerRunningContainers');
      oThis.aDockerRunningContainers = oThis.aDockerRunningContainers.map((v) => {
        v.FormatedCreatedAt = moment(v.CreatedAt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return v;
      })
      if (oThis.sDockerRunningContainersFilterText) {
        oThis.aDockerRunningContainers = oThis.aDockerRunningContainers.filter((v) => ~v.Image.indexOf(oThis.sDockerRunningContainersFilterText));
      }
      oThis.bDockerRunningContainersListShowLoader = false;
    },

    async fnUpdateDockerDaemonInfo()
    {
      var oThis = this;

      oThis.oDockerInfo = await oDockerWS.fnRun('oInfo');
    },

    async fnUpdateDockerHubList()
    {
      var oThis = this;

      oThis.bDockerHubSearchTextShowLoader = false;
      oThis.bDockerHubListShowLoader = true;
      oThis.aDockerHubItems = await oDockerWS.fnRun('oDockerAPI.fnSearch', oThis.sDockerHubSearchText);
      oThis.bDockerHubListShowLoader = false;
    }
  },

  async mounted()
  {
    var oThis = this;

    oDockerWS = new DockerWS();

    oThis.fnUpdateDockerDaemonInfo();
    oThis.fnUpdateDockerHubList();
    oThis.fnUpdateDockerImagesList();
    oThis.fnUpdateDockerContainersList();
    oThis.fnUpdateDockerRunningContainersList();
  },

  async created()
  {
    var oThis = this;
  }
}
</script>
