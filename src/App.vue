<template>
  <v-responsive class="border rounded">
    <v-app>
      <AppBar />
      <SideBar />
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import AppBar from './components/AppBar.vue'
import SideBar from './components/SideBar.vue'
</script>
<style>
</style>
