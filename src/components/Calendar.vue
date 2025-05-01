<template>
  <div class="calendar">
    <ScheduleXCalendar :calendar-app="calendarApp" />
    <v-menu :activator="target" v-model="menu" :close-on-content-click="false">
      <EventCard
        v-if="selectedAppt"
        :appointment="selectedAppt"
        @edit="openEditAppointement"
        @delete="deleteAppointment"
        @check="checkAppointment"
      />
    </v-menu>
    <v-dialog v-model="isAddAppointment" max-width="500">
      <AppointmentForm v-model="appointmentForm">
        <template #actions="{ validation }">
          <v-btn block @click="upsertAppointment(validation)">{{ $t('save') }}</v-btn>
        </template>
      </AppointmentForm>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { injectPGlite, useLiveQuery } from '@electric-sql/pglite-vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'

import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  type CalendarEventExternal,
} from '@schedule-x/calendar'

import '@schedule-x/theme-default/dist/index.css'

import EventCard from './EventCard.vue'
import AppointmentForm from './AppointmentForm.vue'

import { deleteAppointmentDb } from '@/pglite/queries/appointments/deleteAppointmentDb'
import { upsertAppointmentDb } from '@/pglite/queries/appointments/upsertAppointmentDb'
import { appointmentForm, resetAppointmentForm } from '@/views/PatientDetailsView/appointmentState'

import type { Appointment, Patient } from '@/models/models'
import type { VForm } from 'vuetify/components'

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  locale: 'fr-FR',
  dayBoundaries: {
    start: '06:00',
    end: '18:00',
  },
  selectedDate: new Date().toISOString().split('T')[0],
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  firstDayOfWeek: 0,
  weekOptions: {
    gridHeight: 500,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    eventOverlap: true,
  },
  plugins: [],
  callbacks: {
    onEventClick(calendarEvent, e) {
      openEventCard({ calendarEvent, e })
    },
  },
  calendars: {
    checked: {
      colorName: 'checked',
      lightColors: {
        main: '#198754', // Bootstrap green
        container: '#d1e7dd', // Light green background
        onContainer: '#0f5132', // Dark green text
      },
      darkColors: {
        main: '#95d5b2', // Soft mint green
        container: '#2d6a4f', // Dark green background
        onContainer: '#d8f3dc', // Light text
      },
    },
  },
})

const db = injectPGlite()

const route = useRoute()

const target = ref()
const menu = ref(false)
const isAddAppointment = ref(false)
const selectedApptId = ref<string>()

const patientId = route.params.id ?? null

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
  ${patientId ? 'WHERE appointments.patient_id = $1' : ''};
  `,
  patientId ? [patientId] : [],
)

const appointments = computed(
  () => (appointmentsQuery.rows.value || []) as unknown as (Appointment & { patient: Patient })[],
)
const selectedAppt = computed(() => appointments.value.find((a) => a.id === selectedApptId.value))

const eventsItems = computed(() =>
  appointments.value.map((a) => ({
    id: a.id || '',
    title: a.patient.name,
    start: !a.is_select_time
      ? format(a.start_time, 'yyyy-MM-dd')
      : format(a.start_time, 'yyyy-MM-dd HH:mm'),
    end: !a.is_select_time
      ? format(a.end_time, 'yyyy-MM-dd')
      : format(a.end_time, 'yyyy-MM-dd HH:mm'),
    description: a.description,
    calendarId: a.checked ? 'checked' : '',
  })),
)

watchEffect(() => {
  calendarApp.events.set(eventsItems.value)
})

function openEditAppointement(appt: Appointment) {
  appointmentForm.value = { ...appt }
  isAddAppointment.value = true
}

async function deleteAppointment(appt: Appointment) {
  if (appt.id) await deleteAppointmentDb(db, appt.id)
  isAddAppointment.value = false
  menu.value = false
}

async function checkAppointment(appt: Appointment) {
  await upsertAppointmentDb(db, appt)
}

async function upsertAppointment(validation: VForm) {
  await validation.validate()
  if (!validation.isValid) return

  await upsertAppointmentDb(db, appointmentForm.value)
  resetAppointmentForm()
  isAddAppointment.value = false
}

function openEventCard({ calendarEvent, e }: { calendarEvent: CalendarEventExternal; e: UIEvent }) {
  const appt = appointments.value.find((a) => a.id === calendarEvent.id)
  if (!appt) return
  selectedApptId.value = appt.id
  if (e.target) target.value = e.target
  menu.value = true
}
</script>
