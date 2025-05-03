<template>
  <v-responsive>
    <v-app style="background: linear-gradient(135deg, #f9ffff, #fafafc)">
      <AppBar v-model="drawer" />
      <SideBar v-model="drawer" />
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
    <BannerBar />
  </v-responsive>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppBar from '@/components/AppBar.vue'
import SideBar from '@/components/SideBar.vue'
import BannerBar from '@/components/BannerBar.vue'

const route = useRoute()
const router = useRouter()

const drawer = ref(false)

onMounted(() => {
  if (route.path == '/') router.push({ name: 'Schedule' })
})
</script>
