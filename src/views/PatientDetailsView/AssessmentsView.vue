<template>
  <div class="d-flex justify-end">
    <v-btn size="small" color="blue" variant="tonal" @click="isAddAssessment = !isAddAssessment"
      >{{ $t('add') }}
    </v-btn>
  </div>
  <v-expand-transition>
    <CreateAssessment
      v-show="isAddAssessment"
      v-model:form="form"
      v-model:dialog="isAddAssessment"
    />
  </v-expand-transition>
  <div v-if="!isAddAssessment" class="assessments pa-4 text-caption overflow-y-auto">
    <v-sheet height="300" class="w-75" v-if="assessments.length">
      <v-card
        v-for="assessment in sortedAssessments"
        :key="assessment.id"
        class="mb-3"
        elevation="1"
      >
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey">{{ formatDate(assessment.date) }}</div>
              <div class="mt-2">{{ assessment.description }}</div>
            </div>
            <div>
              <v-btn
                size="small"
                elevation="0"
                icon="mdi-square-edit-outline"
                @click="startEditingAssessment(assessment)"
              />
            </div>
          </div>
        </v-card-text>

        <!-- Edit Dialog -->
        <v-dialog v-model="isEditAssessment" max-width="500">
          <AssessmentForm :title="$t('modify-Assessment')" v-model="pickedAssessment">
            <template #actions="{ isValid }">
              <div class="d-flex align-end justify-space-between gap-3">
                <v-btn size="small" variant="tonal" color="red" @click="removeAssessment">
                  {{ $t('delete') }}
                </v-btn>
                <v-btn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="editAssessment(isValid)"
                >
                  {{ $t('save') }}
                </v-btn>
              </div>
            </template>
          </AssessmentForm>
        </v-dialog>
      </v-card>
    </v-sheet>
    <div v-else class="text-grey mt-2">{{ $t('no-assessments-msg') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { injectPGlite, useLiveQuery } from '@electric-sql/pglite-vue'

import CreateAssessment from './CreateAssessment.vue'
import AssessmentForm from '@/components/AssessmentForm.vue'

import { deleteAssessmentDb } from '@/pglite/queries/assessments/deleteAssessmentDb'
import { upsertAssessmentDb } from '@/pglite/queries/assessments/upsertAssessmentDb'

import { form, resetForm } from './assessmentState'

import type { Assessment } from '@/models/models'

const db = injectPGlite()

const props = defineProps<{ patientId: string }>()

form.value.patient_id = props.patientId

const pickedAssessment = ref<Assessment>()
const isAddAssessment = ref(false)
const isEditAssessment = ref(false)

const assessmentsQuery = useLiveQuery<Assessment>(
  `SELECT * FROM assessments WHERE patient_id = $1;`,
  [props.patientId],
)

const assessments = computed(() => assessmentsQuery.rows.value || [])

const sortedAssessments = computed(() => {
  return [...assessments.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})

function startEditingAssessment(assessment: Assessment) {
  pickedAssessment.value = { ...assessment }
  isEditAssessment.value = true
}

async function editAssessment(isValid: boolean) {
  if (!isValid || !pickedAssessment.value) return
  await upsertAssessmentDb(db, pickedAssessment.value)
  resetForm()
  isEditAssessment.value = false
}

async function removeAssessment() {
  if (!pickedAssessment.value) return
  await deleteAssessmentDb(db, pickedAssessment.value.id)
  isEditAssessment.value = false
}

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>
