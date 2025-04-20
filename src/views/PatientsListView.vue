<template>
  <div class="d-flex align-center justify-space-between">
    <h3>Patients list</h3>
    <v-btn variant="tonal">Add patient</v-btn>
  </div>

  <div v-for="patient in patients" :key="patient.id">
    <PatientCard class="my-2" max-width="450" :patient="patient" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PatientCard from '@/views/PatientsListView/PatientCard.vue'

import { patientsData } from '@/assets/fakeData'

const patients = computed(() => patientsData)
</script>
