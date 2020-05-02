<template>
  <div id="q-app" class="row full-width vh100">
    <div class="col vh100">
      <div class="column">
        <div class="col-1 row">
          <div class="col">
            <q-input dense filled v-model="sDockerHubSearchText" label="Search text..." />
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

.vh100 {
  height: 100vh;
}
</style>

<script>
import buildUrl from 'build-url';
const axios = require('axios');

class DockerSearch
{
  sSearchURL = 'https://hub.docker.com/api/content/v1/products/search'

  oParams = {
    page_size: 15,
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

  fnSearch(sSearchString)
  {
    var sURL = this.oDockerSearch.fnSetParams({ q:sSearchString }).toString();

    axios
      .get(sURL)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
}

var oDockerAPI = new DockerAPI();

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
    fnDownloadImage()
    {
      
    },

    fnUpdateDockerHubList()
    {
      var oThis = this;

      oDockerAPI.fnSearch('123');
    }
  },

  created()
  {
    var oThis = this;

    oThis.fnUpdateDockerHubList();
  }
}
</script>
