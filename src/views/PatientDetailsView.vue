<template>
  <div v-if="patient">
    <v-row>
      <v-col cols="4">
        <PatientCard elevation="0" :patient="patient" />
      </v-col>
      <v-divider vertical />
      <v-col>
        <div class="assessments pa-4 text-caption" v-if="assessments.length">
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

          <v-list density="compact" style="line-height: 2">
            <v-list-item v-for="assessment in sortedAssessments" :key="assessment.id" class="pa-2">
              <v-list-item-subtitle>{{ formatDate(assessment.date) }}</v-list-item-subtitle>
              {{ assessment.description }}
            </v-list-item>
          </v-list>
        </div>
        <div v-else class="text-grey mt-2">{{ $t('no-assessments-msg') }}</div>
      </v-col>
    </v-row>
    <v-row v-if="isAddAssessment">
      <v-col cols="6">
        <CreateAssessment v-model="form" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import PatientCard from './PatientsListView/PatientCard.vue'
import CreateAssessment from './PatientDetailsView/CreateAssessment.vue'

import { assessmentData, patientsData } from '@/assets/fakeData'
import { form } from './PatientDetailsView/state'

const route = useRoute()

const isAddAssessment = ref(false)

const patient = computed(() => patientsData.find((p) => p.id == route.params.id))
const assessments = computed(() => assessmentData.filter((a) => a.patient_id === patient.value?.id))

//TODO: refactor
watchEffect(() => {
  const patientId = patient.value?.id
  if (patientId) form.value.patient_id = patientId
})

const sortedAssessments = computed(() => {
  return assessments.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>
