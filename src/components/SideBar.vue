<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item
        title="patients-list"
        @click="$router.push({ name: 'PatientsList' })"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts"></script>
