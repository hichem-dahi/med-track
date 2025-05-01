<template>
  <AssessmentForm :title="$t('new-assessment')" v-model="model" @submit="addAssessment">
    <template #actions>
      <v-btn block variant="tonal" color="primary" type="submit">
        {{ $t('add-assessment') }}
      </v-btn>
    </template>
  </AssessmentForm>
</template>
<script setup lang="ts">
import { injectPGlite } from '@electric-sql/pglite-vue'

import AssessmentForm from '@/components/AssessmentForm.vue'

import { defaultForm } from './assessmentState'

import type { Assessment } from '@/models/models'

import { upsertAssessmentDb } from '@/pglite/queries/assessments/upsertAssessmentDb'

const db = injectPGlite()

const isDialog = defineModel<boolean>('dialog')

const model = defineModel<Assessment>('form', {
  default: defaultForm(),
})

async function addAssessment(isValid: boolean) {
  if (!isValid) return
  await upsertAssessmentDb(db, model.value)
  isDialog.value = false
}
</script>
