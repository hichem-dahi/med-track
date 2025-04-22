<template>
  <v-card>
    <template #append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn size="small" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" :value="i">
            <v-list-item-title>
              <v-icon size="small" :icon="item.icon"></v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template #title>
      <span>{{ patient.name }}</span>
    </template>

    <template #subtitle>
      <span class="text-caption">{{ formatDate(patient.birthday) }}</span>
    </template>
    <template #text>
      <div class="text-caption text-blue-grey-darken-3 text-medium-emphasis" style="line-height: 1.7;">
        <v-row class="py-2">
          <v-col>
            <div>
              <strong>{{ $t('phone') }}:</strong> <br>
              <a :href="`tel:${patient.phone}`">{{ patient.phone }}</a>
            </div>
          </v-col>
          <v-col>
            <div>
              <strong>{{ $t('sex') }}:</strong> <br>
              <div class="text-capitalize">{{ patient.gender }}</div>
            </div>
          </v-col>
        </v-row>
        <div>
          <strong>{{ $t('medical-history') }}</strong>
          <div>{{ patient.medical_history }}</div>
        </div>
      </div>
    </template>
    <template #actions>
      <slot name="actions"></slot>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { Patient } from '@/models/models'

const props = defineProps<{ patient: Patient }>()

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const viewAssessments = () => {
  console.log('Navigate to assessments for', props.patient.name)
}

const editPatient = () => {
  console.log('Editing patient:', props.patient.name)
}

const items = [
  {
    title: 'edit',
    icon: 'mdi-pencil',
  },
  {
    title: 'delete',
    icon: 'mdi-delete',
  },
]
</script>
