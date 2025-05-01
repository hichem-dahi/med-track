<template>
  <div v-if="patient">
    <v-row>
      <v-col cols="12" md="4">
        <PatientCard elevation="0" :patient="patient" />
      </v-col>
      <v-divider vertical />

      <v-col>
        <div class="d-flex justify-space-between">
          <div class="text-subtitle-1">{{ $t('assessments') }}:</div>
          <v-btn
            size="small"
            color="blue"
            variant="tonal"
            @click="isAddAssessment = !isAddAssessment"
            >{{ $t('add') }}
          </v-btn>
        </div>
        <v-expand-transition>
          <CreateAssessment
            v-show="isAddAssessment"
            v-model:form="form"
            v-model:dialog="isAddAssessment"
          />
        </v-expand-transition>
        <div v-if="!isAddAssessment" class="assessments pa-4 text-caption">
          <v-list class="w-75" v-if="assessments.length" density="compact" style="line-height: 2.5">
            <v-list-item v-for="assessment in sortedAssessments" :key="assessment.id" class="pa-2">
              <v-list-item-subtitle>{{ formatDate(assessment.date) }}</v-list-item-subtitle>
              {{ assessment.description }}
              <template #append>
                <v-btn
                  size="small"
                  elevation="0"
                  icon="mdi-square-edit-outline"
                  @click="startEditingAssessment(assessment)"
                />
                <v-dialog v-model="isEditAssessment" max-width="500">
                  <AssessmentForm :title="$t('modify-assessment')" v-model="pickedAssessment">
                    <template #actions="{ isValid }">
                      <div class="d-flex align-end justify-space-between gap-3">
                        <v-btn size="small" variant="tonal" color="red" @click="removeAssessment">
                          {{ $t('delete') }}
                        </v-btn>
                        <v-btn
                          size="small"
                          variant="tonal"
                          color="primary"
                          @click="editAssessment(isValid)"
                        >
                          {{ $t('save') }}
                        </v-btn>
                      </div>
                    </template>
                  </AssessmentForm>
                </v-dialog>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
          <div v-else class="text-grey mt-2">{{ $t('no-assessments-msg') }}</div>
        </div>
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
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { injectPGlite, useLiveQuery } from '@electric-sql/pglite-vue'

import PatientCard from './PatientsListView/PatientCard.vue'
import CreateAssessment from './PatientDetailsView/CreateAssessment.vue'
import AssessmentForm from '@/components/AssessmentForm.vue'
import AppointmentForm from '@/components/AppointmentForm.vue'
import Calendar from '@/components/Calendar.vue'

import { form } from './PatientDetailsView/assessmentState'

import { upsertAssessmentDb } from '@/pglite/queries/assessments/upsertAssessmentDb'
import { deleteAssessmentDb } from '@/pglite/queries/assessments/deleteAssessmentDb'
import { upsertAppointmentDb } from '@/pglite/queries/appointments/upsertAppointmentDb'

import type { VForm } from 'vuetify/components'
import type { Assessment, Patient } from '@/models/models'
import { appointmentForm, resetAppointmentForm } from './PatientDetailsView/appointmentState'

const db = injectPGlite()

const route = useRoute()

const pickedAssessment = ref<Assessment>()
const isAddAssessment = ref(false)
const isEditAssessment = ref(false)
const isAddAppointment = ref(false)

const patientsQuery = useLiveQuery<Patient>(`SELECT * FROM patients WHERE id = $1;`, [
  route.params.id,
])
const assessmentsQuery = useLiveQuery<Assessment>(
  `SELECT * FROM assessments WHERE patient_id = $1;`,
  [route.params.id],
)

const patient = computed(() => patientsQuery.rows.value?.[0])
const assessments = computed(() => assessmentsQuery.rows.value || [])

const sortedAssessments = computed(() => {
  return [...assessments.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})

//TODO: refactor
watchEffect(() => {
  const patientId = patient.value?.id
  if (!patientId) return
  form.value.patient_id = patientId
  appointmentForm.value.patient_id = patientId
})

function startEditingAssessment(assessment: Assessment) {
  pickedAssessment.value = { ...assessment }
  isEditAssessment.value = true
}

async function editAssessment(isValid: boolean) {
  if (!isValid || !pickedAssessment.value) return
  await upsertAssessmentDb(db, pickedAssessment.value)
  isEditAssessment.value = false
}

async function removeAssessment() {
  if (!pickedAssessment.value) return
  await deleteAssessmentDb(db, pickedAssessment.value.id)
  isEditAssessment.value = false
}

async function upsertAppointment(validation: VForm) {
  await validation.validate()
  if (!validation.isValid) return

  await upsertAppointmentDb(db, appointmentForm.value)
  resetAppointmentForm()
  isAddAppointment.value = false
}

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>
