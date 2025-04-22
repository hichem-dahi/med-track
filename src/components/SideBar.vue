<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item
        v-for="item in items"
        :title="item.title"
        :prepend-icon="item.icon"
        @click="$router.push({ name: item.route_name })"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const items = [
  {
    title: t('patients-list'),
    icon: 'mdi-account-multiple',
    route_name: 'PatientsList',
  },
]
</script>
