<template>
  <v-card class="py-2 px-3" min-width="200">
    <template #title>
      <div class="text-body-1">{{ appointment.patient.name }}</div>
    </template>
    <v-card-text class="px-0 text-start">
      <div class="d-flex align-center" v-for="(item, i) in eventItems" :key="i">
        <v-icon color="blue-grey-darken-2" size="x-small" class="mx-2" :icon="item.icon" />
        <div style="line-height: 2" class="text-caption" v-html="item.title" />
      </div>
    </v-card-text>
    <template #append>
      <v-btn
        density="compact"
        size="x-small"
        variant="text"
        :icon="appointment.checked ? `mdi-check-circle` : 'mdi-check-circle-outline'"
        @click="emits('check', { ...appointment, checked: !appointment.checked })"
    /></template>
    <v-card-actions class="justify-end">
      <v-btn
        density="compact"
        size="x-small"
        variant="text"
        icon="mdi-delete"
        @click="isDelete = true"
      />
      <v-btn
        density="compact"
        size="x-small"
        variant="text"
        icon="mdi-pencil"
        @click="emits('edit', appointment)"
      />
    </v-card-actions>
    <ConfirmDeleteModal v-model="isDelete" @confirm="emits('delete', appointment)" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'

import ConfirmDeleteModal from './ConfirmDeleteModal.vue'

import type { Appointment, Patient } from '@/models/models'

const emits = defineEmits<{
  (e: 'edit', appointment: Appointment & { patient: Patient }): void
  (e: 'delete', appointment: Appointment & { patient: Patient }): void
  (e: 'check', appointment: Appointment & { patient: Patient }): void
}>()

const props = defineProps<{ appointment: Appointment & { patient: Patient } }>()

const isDelete = ref(false)

const eventItems = computed(() => {
  const start = props.appointment.start_time
  const end = props.appointment.end_time

  const showTime = props.appointment.is_select_time
  const dateStr = formatDate(start)

  return [
    {
      icon: 'mdi-clock-time-eight',
      title: showTime
        ? `${dateStr} • ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
        : dateStr,
    },
    {
      icon: 'mdi-text-box',
      title: props.appointment.description,
    },
  ]
})

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>
