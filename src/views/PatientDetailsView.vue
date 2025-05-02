<template>
  <div v-if="patient">
    <v-row>
      <v-col cols="12" md="5">
        <PatientCard elevation="0" :patient="patient" />
      </v-col>
      <v-divider vertical />

      <v-col>
        <v-tabs v-model="tab" color="deep-purple-accent-4">
          <v-tab value="1">{{ $t('assessments') }}</v-tab>
          <v-tab value="2">{{ $t('treatments') }}</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="1">
            <AssessmentsView v-if="patient.id" :patientId="patient.id" />
          </v-tabs-window-item>
          <v-tabs-window-item value="2">
            <TreatmentsView v-if="patient.id" :patientId="patient.id" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          class="my-3"
          size="small"
          variant="tonal"
          color="purple"
          @click="isAddAppointment = !isAddAppointment"
          >{{ $t('add-appointment') }}</v-btn
        >
        <v-dialog v-model="isAddAppointment" max-width="500">
          <AppointmentForm v-model="appointmentForm">
            <template #actions="{ validation }">
              <v-btn block @click="upsertAppointment(validation)">{{ $t('save') }}</v-btn>
            </template>
          </AppointmentForm>
        </v-dialog>
        <Calendar />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { injectPGlite, useLiveQuery } from '@electric-sql/pglite-vue'

import PatientCard from './PatientsListView/PatientCard.vue'
import AppointmentForm from '@/components/AppointmentForm.vue'
import Calendar from '@/components/Calendar.vue'

import AssessmentsView from './PatientDetailsView/AssessmentsView.vue'
import TreatmentsView from './PatientDetailsView/TreatmentsView.vue'

import { upsertAppointmentDb } from '@/pglite/queries/appointments/upsertAppointmentDb'

import { appointmentForm, resetAppointmentForm } from './PatientDetailsView/appointmentState'

import type { VForm } from 'vuetify/components'
import type { Patient } from '@/models/models'

const db = injectPGlite()

const route = useRoute()

const tab = ref()

const isAddAppointment = ref(false)

const patientsQuery = useLiveQuery<Patient>(`SELECT * FROM patients WHERE id = $1;`, [
  route.params.id,
])

const patient = computed(() => patientsQuery.rows.value?.[0])

async function upsertAppointment(validation: VForm) {
  await validation.validate()
  if (!validation.isValid || !patient.value?.id) return

  await upsertAppointmentDb(db, { ...appointmentForm.value, patient_id: patient.value.id })
  resetAppointmentForm()
  isAddAppointment.value = false
}
</script>
