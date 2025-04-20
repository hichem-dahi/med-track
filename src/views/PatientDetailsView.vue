<template>
  <div class="d-flex" v-if="patient">
    <v-row>
      <v-col cols="4">
        <PatientCard elevation="0" :patient="patient" />
      </v-col>
      <v-divider vertical />
      <v-col>
        <div class="assessments pa-4 w-100" v-if="patient.assessments?.length">
          <div class="d-flex justify-space-between">
            <strong class="text-subtitle-1">Assessments:</strong>
            <v-btn size="small" color="blue" variant="tonal">Ajouter</v-btn>
          </div>

          <v-list density="compact">
            <v-list-item v-for="assessment in sortedAssessments" :key="assessment.id" class="pa-2">
              <v-list-item-subtitle>{{ formatDate(assessment.date) }}</v-list-item-subtitle>
              {{ assessment.description }}
            </v-list-item>
          </v-list>
        </div>
        <div v-else class="text-grey mt-2">No assessments yet.</div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { patientsData } from '@/assets/fakeData'
import { useRoute } from 'vue-router'
import PatientCard from './PatientsListView/PatientCard.vue'

const route = useRoute()
const patient = computed(() => patientsData.find((p) => p.id == route.params.id))

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const sortedAssessments = computed(() => {
  return patient.value?.assessments?.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})
</script>
