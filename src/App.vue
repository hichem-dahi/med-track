<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { providePGlite } from '@electric-sql/pglite-vue'

import { type LiveNamespace, live } from '@electric-sql/pglite/live'

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
</script>
<style></style>
