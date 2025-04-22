<template>
  <v-card class="pa-4" max-width="600">
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          density="compact"
          v-model="model.name"
          :label="$t('name')"
          :rules="[rules.required]"
          required
        />

        <v-text-field
          density="compact"
          v-model="model.phone"
          :label="$t('phone')"
          :rules="[rules.required]"
          required
        />

        <v-text-field
          density="compact"
          v-model="model.birthday"
          :label="$t('birthday')"
          type="date"
          :rules="[rules.required]"
          required
        />

        <v-select
          density="compact"
          v-model="model.gender"
          :label="$t('sex')"
          :items="genders"
          :rules="[rules.required]"
          required
        />
        <v-textarea
          density="compact"
          v-model="model.medical_history"
          :label="$t('medical-history')"
          auto-grow
        />
      </v-form>
    </v-card-text>

    <template #actions>
      <slot name="actions" :validation="form" />
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Gender, type Patient } from '@/models/models'

defineProps<{ title: string }>()

const form = ref()

const model = defineModel<Patient>({
  default: {
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    medical_history: '',
  },
})

const genders = [
  { title: 'male', value: Gender.Male },
  { title: 'female', value: Gender.Female },
]

const rules = {
  required: (v: number | string) => (v === 0 || !!v) || 'Required',
}
</script>
