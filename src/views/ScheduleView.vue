<template>
  <Calendar :events="eventsItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLiveQuery } from '@electric-sql/pglite-vue'

import { format } from 'date-fns'

import Calendar from '@/components/Calendar.vue'

import type { Appointment, Patient } from '@/models/models'

const appointmentsQuery = useLiveQuery<Appointment & { patient: Patient }>(
  `
  SELECT
    appointments.*,
    json_build_object(
      'id', patients.id,
      'name', patients.name,
      'birthday', patients.birthday,
      'gender', patients.gender,
      'phone', patients.phone,
      'medical_history', patients.medical_history
    ) AS patient
  FROM appointments
  JOIN patients ON appointments.patient_id = patients.id
  `,
  [],
)

const appointments = computed(() => appointmentsQuery.rows.value || [])
const eventsItems = computed(() =>
  appointments.value.map((a) => ({
    id: a.id || '',
    title: a.patient.name,
    start: format(a.start_time, 'yyyy-MM-dd HH:mm'),
    end: format(a.end_time, 'yyyy-MM-dd HH:mm'),
    description: a.description,
  })),
)
</script>
