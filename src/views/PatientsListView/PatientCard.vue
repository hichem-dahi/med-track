<template>
  <v-card>
    <template #append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn size="small" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" :value="i">
            <v-list-item-title>
              <v-icon size="small" :icon="item.icon"></v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template #title>
      <span class="text-h6">{{ patient.name }}</span>
    </template>

    <template #subtitle>
      <span>{{ formatDate(patient.birthday) }}</span>
    </template>

    <template #text>
      <v-row>
        <v-col cols="6">
          <strong>Phone:</strong>
          <div>{{ patient.phone }}</div>
        </v-col>
        <v-col cols="6">
          <strong>Gender:</strong>
          <div class="text-capitalize">{{ patient.gender }}</div>
        </v-col>
      </v-row>
      <br />
      <br />
      <div>
        <strong>Medical History:</strong>
        <div>{{ patient.medical_history }}</div>
      </div>
    </template>
    <template #actions>
      <v-btn
        size="small"
        color="primary"
        @click="$router.push({ name: 'PatientDetails', params: { id: patient.id } })"
      >
        View Assessments
      </v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { Patient } from '@/models/models'

const props = defineProps<{ patient: Patient }>()

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const viewAssessments = () => {
  console.log('Navigate to assessments for', props.patient.name)
}

const editPatient = () => {
  console.log('Editing patient:', props.patient.name)
}

const items = [
  {
    title: 'edit',
    icon: 'mdi-pencil',
  },
  {
    title: 'delete',
    icon: 'mdi-delete',
  },
]
</script>
