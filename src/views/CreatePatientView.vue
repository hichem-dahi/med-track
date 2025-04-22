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
import type { VForm } from 'vuetify/components'

import PatientForm from '@/components/PatientForm.vue'

import { Gender } from '@/models/models'
import { patientsData } from '@/assets/fakeData'

const router = useRouter()

const form = ref({
  id: '',
  name: '',
  phone: '',
  birthday: '',
  gender: Gender.Male,
  medical_history: '',
})

function addPatient(validation: VForm) {
  validation.validate()
  if (validation.isValid) {
    console.log(form.value)
    patientsData.push(form.value)
    router.go(-1)
  }
}
</script>
