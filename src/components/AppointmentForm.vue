<template>
  <v-card class="pa-4" max-width="600">
    <v-form ref="formRef" validate-on="submit lazy">
      <v-text-field v-model="model[0].description" :label="$t('description')" />

      <v-date-input v-model="form.date" :label="$t('select-a-date')" :rules="[rules.required]" />
      <v-checkbox
        hide-details
        density="compact"
        :label="$t('select-time')"
        v-model="model[0].is_select_time"
      />

      <div class="d-flex ga-5">
        <v-text-field
          :disabled="!model[0].is_select_time"
          type="time"
          v-model="form.startTime"
          :label="$t('start-time')"
          :rules="model[0].is_select_time ? [rules.required, rules.timeOrder, rules.noOverlap] : []"
        />
        <v-text-field
          :disabled="!model[0].is_select_time"
          type="time"
          v-model="form.endTime"
          :label="$t('end-time')"
          :rules="model[0].is_select_time ? [rules.required] : []"
        />
      </div>

      <v-checkbox
        hide-details
        density="compact"
        :label="$t('recurrent-date')"
        v-model="isRecurrentDate"
      />
      <div v-if="isRecurrentDate" class="d-flex align-center ga-5">
        <div>{{ $t('every') }} {{ days[selectDay] }}</div>
        <v-date-input
          prepend-icon=""
          prepend-inner-icon="$calendar"
          v-model="recurrentDateForm.untilDate"
          :min="new Date()"
          :label="$t('until-date')"
          :rules="[rules.required]"
          :hint="`${recurrentDates?.length} ${$t('appointments')}`"
        />
      </div>
    </v-form>
    <slot name="actions" :validation="formRef" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { addDays, format, getDay, isBefore, isSameDay } from 'date-fns'

import { useIsoverlappingDate } from '@/composables/useIsOverlappingDate'

import type { Appointment } from '@/models/models'

const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const formRef = ref()

const isRecurrentDate = ref(false)
const recurrentDateForm = ref({
  untilDate: new Date(),
})

const { date, noOverlap, overlappingAppointments, currentAppt } = useIsoverlappingDate()

const model = defineModel<Appointment[]>({
  default: [
    {
      patient_id: '',
      description: '',
      start_time: '',
      end_time: '',
      is_select_time: true,
      checked: false,
    },
  ],
})

currentAppt.value = { ...model.value[0] }

const form = reactive({
  date: model.value[0].start_time ? new Date(model.value[0].start_time) : new Date(),
  startTime: model.value[0].start_time
    ? format(new Date(model.value[0].start_time), 'HH:mm')
    : '12:00',
  endTime: model.value[0].start_time ? format(new Date(model.value[0].end_time), 'HH:mm') : '12:00',
})

const selectDay = computed(() => getDay(model.value[0].start_time))

const recurrentDates = computed(() => {
  if (!isRecurrentDate.value) return []

  const start = date.value
  const end = recurrentDateForm.value.untilDate
  const dates: Date[] = []

  let current = start
  if (!current) return
  while (isBefore(current, end) || isSameDay(current, end)) {
    dates.push(current)
    current = addDays(current, 7)
  }

  return dates
})

// Combine date + time into ISO datetime strings
watch(
  () => [form.date, form.startTime, form.endTime],
  ([newDate, start, end]) => {
    model.value[0].start_time = setTime(new Date(newDate), start as string)
    model.value[0].end_time = setTime(new Date(newDate), end as string)
    date.value = new Date(newDate)
  },
  { immediate: true },
)

watch(recurrentDates, (dates) => {
  if (dates)
    model.value = [
      model.value[0],
      ...dates.flatMap((date) => {
        const start_time = setTime(date, form.startTime)
        const end_time = setTime(date, form.endTime)

        return { ...model.value[0], start_time, end_time }
      }),
    ]
})

function setTime(date: Date, time: string) {
  const dateStr = format(date, 'yyyy-MM-dd')
  return dateStr && time ? new Date(`${dateStr}T${time}`) : ''
}

const rules = {
  required: (v: string) => !!v || 'Required field',
  timeOrder: () => form.startTime < form.endTime || 'Start time must be before end time',
  noOverlap: () => noOverlap(model.value[0].start_time, model.value[0].end_time),
}
</script>
