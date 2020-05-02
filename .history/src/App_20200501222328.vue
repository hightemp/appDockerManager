<template>
  <div id="q-app" class="column full-width full-height">
    <div class="col full-height">
      <div class="row full-height">
        <div class="col-1 column">
          <div class="row">
            <div class="col">
              <q-input filled v-model="text" label="Filled" />
            </div>
            <div class="col-1">
              <q-btn icon="more_vert">
                <q-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section>Open...</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
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
    <div class="col full-height">
      2
    </div>
    <div class="col full-height">
      3
    </div>
  </div>
</template>

<style>
html, body {
  height: 100vh;
}

100vh {
  height: 100vh;
}
</style>

<script>
export default {
  name: 'App',

  data()
  {
    return {

    }
  },

  created()
  {

  }
}
</script>
