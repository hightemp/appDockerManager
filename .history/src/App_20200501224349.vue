<template>
  <div id="q-app" class="row full-width vh100">
    <div class="col vh100">
      <div class="column">
        <div class="col-1 row">
          <div class="col">
            <q-input filled v-model="text" label="Filled" />
          </div>
          <div class="col-2">
            <q-btn flat icon="more_vert">
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
      2
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
