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
            <q-input dense filled v-model="text" label="Search text..." />
          </div>
          <div class="col-2">
            <q-btn flat icon="more_vert" class="full-width full-height">
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>Download</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <div class="col">

          <q-virtual-scroll
            style=""
            :items="heavyList"
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

class DockerSearch
{
  sSearchURL = 'https://hub.docker.com/api/content/v1/products/search'

  oParams = {
    page_size: '',
    q: '',
    source: ''
  }

  constructor(oParams)
  {
    this.oParams = {...this.oParams, ...oParams};
    // '?page_size=100&q=%2B&source=community'
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
    
  }

  fnSearch()
  {

  }
}

export default {
  name: 'App',

  data()
  {
    return {
      sDockerHubSearchText: '',
      aDockerHubItems: [],
      aDockerImages: [],
      aDockerContainers: [],
    }
  },

  fnUpdateDockerHubList()
  {
    var oThis = this;


  },

  created()
  {

  }
}
</script>
