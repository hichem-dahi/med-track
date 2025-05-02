<template>
  <div class="d-flex justify-end">
    <v-btn size="small" color="blue" variant="tonal" @click="isAddTreatment = !isAddTreatment"
      >{{ $t('add') }}
    </v-btn>
  </div>
  <v-expand-transition>
    <CreateTreatment v-show="isAddTreatment" v-model:form="form" v-model:dialog="isAddTreatment" />
  </v-expand-transition>
  <div v-if="!isAddTreatment" class="Treatments pa-4 text-caption overflow-y-auto">
    <v-list
      height="250"
      class="w-75"
      v-if="treatments.length"
      density="compact"
      style="line-height: 2.5"
    >
      <v-list-item v-for="treatment in sortedTreatments" :key="treatment.id" class="pa-2">
        <v-list-item-subtitle class="pa-3">
          {{ formatDate(treatment.date) }}
        </v-list-item-subtitle>
        {{ treatment.description }}
        <template #append>
          <v-btn
            size="small"
            elevation="0"
            icon="mdi-square-edit-outline"
            @click="startEditingTreatment(treatment)"
          />
          <v-dialog v-model="isEditTreatment" max-width="500">
            <TreatmentForm :title="$t('modify-Treatment')" v-model="pickedTreatment">
              <template #actions="{ isValid }">
                <div class="d-flex align-end justify-space-between gap-3">
                  <v-btn size="small" variant="tonal" color="red" @click="removeTreatment">
                    {{ $t('delete') }}
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="primary"
                    @click="editTreatment(isValid)"
                  >
                    {{ $t('save') }}
                  </v-btn>
                </div>
              </template>
            </TreatmentForm>
          </v-dialog>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
    <div v-else class="text-grey mt-2">{{ $t('no-treatments-msg') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { injectPGlite, useLiveQuery } from '@electric-sql/pglite-vue'

import CreateTreatment from './CreateTreatment.vue'
import TreatmentForm from '@/components/TreatmentForm.vue'

import { deleteTreatmentDb } from '@/pglite/queries/treatments/deleteTreatmentDb'
import { upsertTreatmentDb } from '@/pglite/queries/treatments/upsertTreatmentDb'

import { form } from './treatmentState'

import type { Treatment } from '@/models/models'

const db = injectPGlite()

const props = defineProps<{ patientId: string }>()

form.value.patient_id = props.patientId

const pickedTreatment = ref<Treatment>()
const isAddTreatment = ref(false)
const isEditTreatment = ref(false)

const treatmentsQuery = useLiveQuery<Treatment>(`SELECT * FROM treatments WHERE patient_id = $1;`, [
  props.patientId,
])

const treatments = computed(() => treatmentsQuery.rows.value || [])

const sortedTreatments = computed(() => {
  return [...treatments.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
})

function startEditingTreatment(Treatment: Treatment) {
  pickedTreatment.value = { ...Treatment }
  isEditTreatment.value = true
}

async function editTreatment(isValid: boolean) {
  if (!isValid || !pickedTreatment.value) return
  await upsertTreatmentDb(db, pickedTreatment.value)
  isEditTreatment.value = false
}

async function removeTreatment() {
  if (!pickedTreatment.value) return
  await deleteTreatmentDb(db, pickedTreatment.value.id)
  isEditTreatment.value = false
}

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>
