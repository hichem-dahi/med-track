<template>
  <v-card class="pa-4" max-width="600">
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-form v-model="isValid" @submit.prevent="emits('submit', isValid)">
        <v-textarea
          v-model="model.description"
          :label="$t('description')"
          auto-grow
          :rules="[rules.required]"
        />

        <v-date-input
          :label="$t('select-a-date')"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          v-model="model.date"
        ></v-date-input>

        <slot name="actions" :isValid="isValid" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { defaultForm } from '@/views/PatientDetailsView/state'

import type { Assessment } from '@/models/models'

const emits = defineEmits<{
  (e: 'submit', isValid: boolean): void
}>()

defineProps<{ title: string }>()

const model = defineModel<Assessment>({
  default: defaultForm(),
})

const isValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'Required',
}
</script>
