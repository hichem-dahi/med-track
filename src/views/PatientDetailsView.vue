<template>
  <div v-if="patient">
    <v-row>
      <div class="text-h5 pa-4">{{ $t('patient-info') }}</div>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <PatientCard elevation="0" variant="text" :patient="patient" />
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
    <v-row style="margin-top: 80px">
      <v-col>
        <div class="text-h6 py-4">{{ $t('schedule') }}</div>

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

const patientsQuery = useLiveQuery<Patient>(
  `
  SELECT
    patients.*,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', patient_images.id,
          'image_url', patient_images.image_url,
          'description', patient_images.description
        )
      ) FILTER (WHERE patient_images.id IS NOT NULL), '[]'::jsonb
    ) AS images
  FROM patients
  LEFT JOIN patient_images ON patient_images.patient_id = patients.id
  WHERE patients.id = $1
  GROUP BY patients.id;
  `,
  [route.params.id],
)

const patient = computed(() => patientsQuery.rows.value?.[0] as unknown as Patient)

async function upsertAppointment(validation: VForm) {
  await validation.validate()
  if (!validation.isValid || !patient.value?.id) return

  await upsertAppointmentDb(db, { ...appointmentForm.value, patient_id: patient.value.id })
  resetAppointmentForm()
  isAddAppointment.value = false
}
</script>
