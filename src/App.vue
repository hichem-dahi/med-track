<template>
  <v-responsive class="border rounded">
    <v-app>
      <AppBar />
      <SideBar v-model="drawer" />
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppBar from './components/AppBar.vue'
import SideBar from './components/SideBar.vue'

import { providePGlite } from '@electric-sql/pglite-vue'
import { type LiveNamespace, live } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'

type PGliteWithLive = PGliteWorker & { live: LiveNamespace }

const db = new PGliteWorker(
  new Worker(new URL('./pglite/pglite.ts', import.meta.url), {
    type: 'module',
  }),
  {
    extensions: { live },
  },
) as PGliteWithLive

providePGlite(db)

const drawer = ref(true)

onMounted(() => {
  setTimeout(() => {
    drawer.value = true
  }, 100)
})
</script>
<style></style>
