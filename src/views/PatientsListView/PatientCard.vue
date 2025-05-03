<template>
  <v-card>
    <template #append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn size="small" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list density="compact">
          <v-list-item v-for="(item, i) in items" :key="i" :value="i" @click="item.function">
            <v-btn variant="text" size="small" :prepend-icon="item.icon" @click="item.function">
              {{ item.title }}
            </v-btn>
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
        class="text-body-2 text-blue-grey-darken-3 text-medium-emphasis"
        style="line-height: 1.7"
      >
        <v-row class="py-2">
          <v-col cols="6" v-for="(item, i) in patientItems" :key="i">
            <div>
              <strong>{{ item.title }}:</strong> <br />
              <div class="text-capitalize" v-html="item.html" />
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
    <v-dialog v-model="isImages" max-width="400">
      <v-card>
        <v-card-text>
          <v-carousel
            height="300"
            v-if="patient.images && patient.images.length > 0"
            :show-arrows="false"
          >
            <v-carousel-item
              v-for="(image, index) in patient.images"
              :key="index"
              :src="image.image_url"
            >
              <template #sources>
                <div class="text-end">
                  <v-btn
                    v-if="image.id"
                    variant="text"
                    icon="mdi-delete"
                    @click="deleteImage(image.id)"
                  />
                </div>
              </template>
            </v-carousel-item>
          </v-carousel>
          <p v-else>No images available</p>
        </v-card-text>
        <v-file-upload v-model="imagesFiles" multiple density="compact" />
        <v-card-actions>
          <v-btn :loading="isLoading" @click="upsertImages">{{ $t('upload') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDeleteModal v-model="isDelete" @confirm="removePatient" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { injectPGlite } from '@electric-sql/pglite-vue'
import { useI18n } from 'vue-i18n'

import { calculateAge, fileToBase64, formatDate } from '@/utils/utils'

import PatientForm from '@/components/PatientForm.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

import { upsertPatientDb } from '@/pglite/queries/patients/upsertPatientsDb'
import { deletePatientDb } from '@/pglite/queries/patients/deletePatientDb'
import { upsertPatientImagesDb } from '@/pglite/queries/patient_images/upsertPatientImagesDb'
import { deletePatientImagesDb } from '@/pglite/queries/patient_images/deletePatientImagesDb'

import type { Patient, PatientImage } from '@/models/models'
import type { VForm } from 'vuetify/components'

const { t } = useI18n()

const isEdit = ref(false)
const isDelete = ref(false)
const isImages = ref(false)
const isLoading = ref(false)
const imagesFiles = ref<File[]>([])

const items = [
  {
    title: t('edit'),
    icon: 'mdi-pencil',
    function: () => (isEdit.value = true),
  },
  {
    title: t('images'),
    icon: 'mdi-image-plus',
    function: () => (isImages.value = true),
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

const patientItems = ref([
  { title: t('phone'), html: `<a href="tel:${props.patient.phone}">${props.patient.phone}</a>` },
  { title: t('sex'), html: t(props.patient.gender) },
  { title: t('age'), html: calculateAge(props.patient.birthday) },
  { title: t('first-consultation'), html: formatDate(props.patient.first_consultation_date) },
])

const editPatient = async (validation: VForm) => {
  validation.validate()
  if (!validation.isValid) return
  await upsertPatientDb(db, { ...form.value })
  isEdit.value = false
}

async function upsertImages() {
  const patient_id = props.patient.id
  if (!imagesFiles.value?.length || !patient_id) return

  isLoading.value = true
  const form: PatientImage[] = await Promise.all(
    imagesFiles.value.map(async (f) => {
      const base64 = await fileToBase64(f) // Await the Base64 conversion
      return {
        patient_id,
        image_url: base64,
        description: '', // Add description if needed
      }
    }),
  )

  await upsertPatientImagesDb(db, form)
  isLoading.value = false
}

async function deleteImage(id: string) {
  await deletePatientImagesDb(db, [id])
}
const removePatient = async () => {
  if (props.patient.id) await deletePatientDb(db, props.patient.id)
}
</script>
