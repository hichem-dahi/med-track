<template>
  <div v-if="patient">
    <v-row>
      <v-col cols="12" md="5">
        <PatientCard elevation="0" :patient="patient" />
      </v-col>
      <v-divider vertical />

      <v-col>
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="1">{{ $t('assessments') }}</v-tab>
          <v-tab value="2">{{ $t('treatment') }}</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="1">
            <div class="d-flex justify-end">
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
            <div v-if="!isAddAssessment" class="assessments pa-4 text-caption overflow-y-auto">
              <v-list
                height="250"
                class="w-75"
                v-if="assessments.length"
                density="compact"
                style="line-height: 2.5"
              >
                <v-list-item
                  v-for="assessment in sortedAssessments"
                  :key="assessment.id"
                  class="pa-2"
                >
                  <v-list-item-subtitle class="pa-3">
                    {{ formatDate(assessment.date) }}
                  </v-list-item-subtitle>
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
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="red"
                              @click="removeAssessment"
                            >
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
          </v-tabs-window-item>
          <v-tabs-window-item value="2">
            <div class="d-flex justify-end">
              <v-btn
                size="small"
                color="blue"
                variant="tonal"
                @click="isAddTreatment = !isAddTreatment"
                >{{ $t('add') }}
              </v-btn>
            </div>
            <v-expand-transition>
              <CreateTreatment
                v-show="isAddTreatment"
                v-model:form="form"
                v-model:dialog="isAddTreatment"
              />
            </v-expand-transition>
            <div v-if="!isAddTreatment" class="treatments pa-4 text-caption overflow-y-auto">
              <v-list
                height="250"
                class="w-75"
                v-if="treatments.length"
                density="compact"
                style="line-height: 2.5"
              >
                <v-list-item v-for="treatment in sortedTreatments" :key="treatment.id" class="pa-2">
                  <v-list-item-subtitle class="pa-3">
                    {{ formatDate(treatment.date) }}
                  </v-list-item-subtitle>
                  {{ treatment.description }}
                  <template #append>
                    <v-btn
                      size="small"
                      elevation="0"
                      icon="mdi-square-edit-outline"
                      @click="startEditingTreatment(treatment)"
                    />
                    <v-dialog v-model="isEditTreatment" max-width="500">
                      <TreatmentForm :title="$t('modify-TreatmentForm')" v-model="pickedTreatment">
                        <template #actions="{ isValid }">
                          <div class="d-flex align-end justify-space-between gap-3">
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="red"
                              @click="removeTreatment"
                            >
                              {{ $t('delete') }}
                            </v-btn>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="primary"
                              @click="editTreatment(isValid)"
                            >
                              {{ $t('save') }}
                            </v-btn>
                          </div>
                        </template>
                      </TreatmentForm>
                    </v-dialog>
                  </template>
                </v-list-item>
                <v-divider></v-divider>
              </v-list>
              <div v-else class="text-grey mt-2">{{ $t('no-treatment-msg') }}</div>
            </div>
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

import { appointmentForm, resetAppointmentForm } from './PatientDetailsView/appointmentState'

import type { VForm } from 'vuetify/components'
import type { Assessment, Patient } from '@/models/models'
import TreatmentForm from '@/components/TreatmentForm.vue'
import CreateTreatment from './PatientDetailsView/CreateTreatment.vue'
import { upsertTreatmentDb } from '@/pglite/queries/treatments/upsertTreatmentDb'
import { deleteTreatmentDb } from '@/pglite/queries/treatments/deleteTreatmentDb'

const db = injectPGlite()

const route = useRoute()

const tab = ref()

const pickedAssessment = ref<Assessment>()
const isAddAssessment = ref(false)
const isEditAssessment = ref(false)

const isAddAppointment = ref(false)

const pickedTreatment = ref<Assessment>()
const isAddTreatment = ref(false)
const isEditTreatment = ref(false)

const patientsQuery = useLiveQuery<Patient>(`SELECT * FROM patients WHERE id = $1;`, [
  route.params.id,
])
const assessmentsQuery = useLiveQuery<Assessment>(
  `SELECT * FROM assessments WHERE patient_id = $1;`,
  [route.params.id],
)

const treatmentsQuery = useLiveQuery<Assessment>(
  `SELECT * FROM treatments WHERE patient_id = $1;`,
  [route.params.id],
)

const patient = computed(() => patientsQuery.rows.value?.[0])
const assessments = computed(() => assessmentsQuery.rows.value || [])
const treatments = computed(() => treatmentsQuery.rows.value || [])

const sortedAssessments = computed(() => {
  return [...assessments.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})

const sortedTreatments = computed(() => {
  return [...treatments.value].sort(
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

function startEditingTreatment(treatment: Assessment) {
  pickedTreatment.value = { ...treatment }
  isEditTreatment.value = true
}

async function editAssessment(isValid: boolean) {
  if (!isValid || !pickedAssessment.value) return
  await upsertAssessmentDb(db, pickedAssessment.value)
  isEditAssessment.value = false
}

async function editTreatment(isValid: boolean) {
  if (!isValid || !pickedTreatment.value) return
  await upsertTreatmentDb(db, pickedTreatment.value)
  isEditTreatment.value = false
}

async function removeAssessment() {
  if (!pickedAssessment.value) return
  await deleteAssessmentDb(db, pickedAssessment.value.id)
  isEditAssessment.value = false
}

async function removeTreatment() {
  if (!pickedAssessment.value) return
  await deleteTreatmentDb(db, pickedAssessment.value.id)
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
