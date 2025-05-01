<template>
  <PatientForm :title="$t('new-patient')" v-model="form">
    <template #actions="{ validation }">
      <v-btn block variant="tonal" color="primary" @click="addPatient(validation)">
        {{ $t('add-patient') }}
      </v-btn>
    </template>
  </PatientForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { injectPGlite } from '@electric-sql/pglite-vue'
import type { VForm } from 'vuetify/components'

import PatientForm from '@/components/PatientForm.vue'

import { upsertPatientDb } from '@/pglite/queries/patients/upsertPatientsDb'

import { type Patient } from '@/models/models'

const db = injectPGlite()

const router = useRouter()

const form = ref<Patient>({
  name: '',
  phone: '',
  birthday: new Date(),
  gender: 'male',
  medical_history: '',
})

async function addPatient(validation: VForm) {
  validation.validate()
  if (validation.isValid) {
    await upsertPatientDb(db, form.value)
    router.go(-1)
  }
}
</script>
