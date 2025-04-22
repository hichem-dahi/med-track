<template>
  <div class="d-flex align-center justify-space-between">
    <h3>{{ $t('patients-list') }}</h3>
    <v-btn
      size="small"
      variant="tonal"
      @click="$router.push({ name: 'CreatePatient' })"
    >
      {{ $t('add-patient') }}
    </v-btn>
  </div>

  <div v-for="patient in patients" :key="patient.id">
    <PatientCard class="my-2" max-width="450" :patient="patient">
      <template #actions>
        <v-btn
          size="small"
          color="primary"
          @click="$router.push({ name: 'PatientDetails', params: { id: patient.id } })"
        >
          {{$t('view-assessments')}}
        </v-btn>
      </template>
    </PatientCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PatientCard from '@/views/PatientsListView/PatientCard.vue'

import { patientsData } from '@/assets/fakeData'

const patients = computed(() => patientsData)
</script>
