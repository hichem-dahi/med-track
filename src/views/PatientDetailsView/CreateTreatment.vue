<template>
  <TreatmentForm :title="$t('new-treatment')" v-model="model" @submit="addTreatment">
    <template #actions>
      <v-btn block variant="tonal" color="primary" type="submit">
        {{ $t('add-treatment') }}
      </v-btn>
    </template>
  </TreatmentForm>
</template>
<script setup lang="ts">
import { injectPGlite } from '@electric-sql/pglite-vue'

import TreatmentForm from '@/components/TreatmentForm.vue'

import { upsertTreatmentDb } from '@/pglite/queries/treatments/upsertTreatmentDb'

import { defaultForm, resetForm } from './treatmentState'

import type { Treatment } from '@/models/models'

const db = injectPGlite()

const isDialog = defineModel<boolean>('dialog')

const model = defineModel<Treatment>('form', {
  default: defaultForm(),
})

async function addTreatment(isValid: boolean) {
  if (!isValid) return
  await upsertTreatmentDb(db, model.value)
  resetForm()
  isDialog.value = false
}
</script>
