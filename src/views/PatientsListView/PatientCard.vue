<template>
  <v-card>
    <template #append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn size="small" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list density="compact">
          <v-list-item v-for="(item, i) in items" :key="i" :value="i" @click="item.function">
            <v-btn variant="text" size="small" :prepend-icon="item.icon" @click="item.function">{{
              item.title
            }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template #title>
      <span class="text-subtitle-1">{{ patient.name }}</span>
    </template>

    <template #subtitle>
      <span class="text-caption">{{ formatDate(patient.birthday) }}</span>
    </template>
    <template #text>
      <div
        class="text-caption text-blue-grey-darken-3 text-medium-emphasis"
        style="line-height: 1.7"
      >
        <v-row class="py-2">
          <v-col>
            <div>
              <strong>{{ $t('phone') }}:</strong> <br />
              <a :href="`tel:${patient.phone}`" @click.stop>{{ patient.phone }}</a>
            </div>
          </v-col>
          <v-col>
            <div>
              <strong>{{ $t('sex') }}:</strong> <br />
              <div class="text-capitalize">{{ patient.gender }}</div>
            </div>
          </v-col>
          <v-col>
            <div>
              <strong>{{ $t('age') }}:</strong> <br />
              <div class="text-capitalize">
                {{ calculateAge(patient.birthday) }}
              </div>
            </div>
          </v-col>
        </v-row>

        <div>
          <strong>{{ $t('medical-history') }}</strong>
          <div>{{ patient.medical_history }}</div>
        </div>
      </div>
    </template>
    <template #actions>
      <slot name="actions"></slot>
    </template>

    <v-dialog v-model="isEdit" max-width="500">
      <PatientForm :title="$t('edit-patient-info')" v-model="form">
        <template #actions="{ validation }">
          <v-btn block variant="tonal" color="primary" @click="editPatient(validation)">
            {{ $t('save') }}
          </v-btn>
        </template>
      </PatientForm>
    </v-dialog>
    <ConfirmDeleteModal v-model="isDelete" @confirm="removePatient" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { injectPGlite } from '@electric-sql/pglite-vue'
import { useI18n } from 'vue-i18n'

import PatientForm from '@/components/PatientForm.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

import { upsertPatient } from '@/pglite/queries/patients/upsertPatients'
import { deletePatient } from '@/pglite/queries/patients/deletePatient'

import type { Patient } from '@/models/models'
import type { VForm } from 'vuetify/components'

const { t } = useI18n()

const isEdit = ref(false)
const isDelete = ref(false)

const items = [
  {
    title: t('edit'),
    icon: 'mdi-pencil',
    function: () => (isEdit.value = true),
  },
  {
    title: t('delete'),
    icon: 'mdi-delete',
    function: () => (isDelete.value = true),
  },
]

const db = injectPGlite()

const props = defineProps<{ patient: Patient }>()

const form = ref({ ...props.patient })

const editPatient = async (validation: VForm) => {
  validation.validate()
  if (!validation.isValid) return
  await upsertPatient(db, { ...form.value })
  isEdit.value = false
}

const removePatient = async () => {
  if (props.patient.id) await deletePatient(db, props.patient.id)
}

const formatDate = (date: Date | string) =>
  new Date(date || 0).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

function calculateAge(birthday: Date | string): number {
  const birthDate = new Date(birthday)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }

  return age
}
</script>
