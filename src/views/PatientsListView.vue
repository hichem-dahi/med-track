<template>
  <div class="d-flex align-center justify-space-between pa-4">
    <h3>{{ $t('patients-list') }}</h3>
    <v-btn size="small" variant="tonal" @click="$router.push({ name: 'CreatePatient' })">
      {{ $t('add-patient') }}
    </v-btn>
  </div>

  <div v-if="patients.length">
    <div v-for="patient in patients" :key="patient.id">
      <PatientCard
        class="my-2"
        max-width="450"
        :patient="patient"
        @click="$router.push({ name: 'PatientDetails', params: { id: patient.id } })"
      >
        <template #actions>
          <v-btn
            size="small"
            color="primary"
            @click="$router.push({ name: 'PatientDetails', params: { id: patient.id } })"
          >
            {{ $t('view-patient') }}
          </v-btn>
        </template>
      </PatientCard>
    </div>
  </div>
  <div v-else class="text-start text-grey">
    {{ $t('no-patients-found') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLiveQuery } from '@electric-sql/pglite-vue'

import PatientCard from '@/views/PatientsListView/PatientCard.vue'

import type { Patient } from '@/models/models'

const patientsQuery = useLiveQuery<Patient>(`SELECT * FROM patients;`)

const patients = computed(() => patientsQuery.rows.value || [])
</script>
