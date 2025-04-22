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
import AssessmentForm from '@/components/AssessmentForm.vue'

import { defaultForm } from './state'

import type { Assessment } from '@/models/models'

import { assessmentData } from '@/assets/fakeData'

const model = defineModel<Assessment>({
  default: defaultForm(),
})

function addAssessment(isValid: boolean) {
  if (!isValid) return
  assessmentData.push(model.value)
  console.log(assessmentData)
}
</script>
