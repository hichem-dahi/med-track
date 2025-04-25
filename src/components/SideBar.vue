<template>
  <v-navigation-drawer v-model="drawer" expand-on-hover :rail="!$vuetify.display.mobile">
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :title="item.title"
        :prepend-icon="item.icon"
        @click="$router.push({ name: item.route_name })"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const drawer = defineModel<boolean>()

const items = [
  {
    title: t('patients-list'),
    icon: 'mdi-account-multiple',
    route_name: 'PatientsList',
  },
  {
    title: t('schedule'),
    icon: 'mdi-calendar',
    route_name: 'Schedule',
  },
]
</script>
