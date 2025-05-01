<template>
  <v-app-bar height="70">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <template #title>
      <img height="50" src="/logo-cropped.png" alt="" />
    </template>
  </v-app-bar>
</template>
<script setup lang="ts">
const drawer = defineModel<boolean>()
</script>
