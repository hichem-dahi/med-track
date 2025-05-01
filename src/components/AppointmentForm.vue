<template>
  <v-card class="pa-4" max-width="600">
    <v-form ref="formRef" validate-on="submit lazy">
      <v-text-field v-model="model.description" :label="$t('description')" />

      <v-date-input v-model="form.date" :label="$t('select-a-date')" :rules="[rules.required]" />
      <v-checkbox :label="$t('select-time')" v-model="model.is_select_time"></v-checkbox>
      <div class="d-flex ga-5">
        <v-text-field
          :disabled="!model.is_select_time"
          type="time"
          v-model="form.startTime"
          :label="$t('start-time')"
          :rules="model.is_select_time ? [rules.required, rules.timeOrder, rules.noOverlap] : []"
        />
        <v-text-field
          :disabled="!model.is_select_time"
          type="time"
          v-model="form.endTime"
          :label="$t('end-time')"
          :rules="model.is_select_time ? [rules.required] : []"
        />
      </div>
    </v-form>
    <slot name="actions" :validation="formRef" />
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { format } from 'date-fns'

import { useIsoverlappingDate } from '@/composables/useIsOverlappingDate'

import type { Appointment } from '@/models/models'

const formRef = ref()

const { date, noOverlap, overlappingAppointments, currentAppt } = useIsoverlappingDate()

const model = defineModel<Appointment>({
  default: {
    patient_id: '',
    description: '',
    start_time: '',
    end_time: '',
    is_select_time: true,
  },
})

currentAppt.value = { ...model.value }

const form = reactive({
  date: model.value.start_time ? new Date(model.value.start_time) : new Date(),
  startTime: model.value.start_time ? format(new Date(model.value.start_time), 'HH:mm') : '12:00',
  endTime: model.value.start_time ? format(new Date(model.value.end_time), 'HH:mm') : '12:00',
})

// Combine date + time into ISO datetime strings
watch(
  () => [form.date, form.startTime, form.endTime],
  ([newDate, start, end]) => {
    const dateStr = format(newDate, 'yyyy-MM-dd')
    model.value.start_time = dateStr && start ? new Date(`${dateStr}T${start}`) : ''
    model.value.end_time = dateStr && end ? new Date(`${dateStr}T${end}`) : ''
    date.value = new Date(newDate)
  },
  { immediate: true },
)

const rules = {
  required: (v: string) => !!v || 'Required field',
  timeOrder: () => form.startTime < form.endTime || 'Start time must be before end time',
  noOverlap: () => noOverlap(model.value.start_time, model.value.end_time),
}
</script>
