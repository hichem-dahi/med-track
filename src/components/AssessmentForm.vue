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

        <v-text-field
          v-model="model.date"
          :label="$t('date')"
          type="date"
          :rules="[rules.required]"
        />

        <slot name="actions" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { defaultForm } from '@/views/PatientDetailsView/state';

import type { Assessment } from '@/models/models'

const emits = defineEmits<{
  (e: 'submit', isValid: boolean): void
}>()

defineProps<{ title: string }>()

const model = defineModel<Assessment>({
  default: defaultForm()
})

const isValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'Required',
}
</script>
