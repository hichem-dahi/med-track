<template>
  <v-card class="pa-4" max-width="600">
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-form ref="validation">
        <v-text-field
          density="compact"
          v-model="model.name"
          :label="$t('name')"
          :rules="[rules.required, rules.name]"
          required
        />

        <v-text-field
          density="compact"
          v-model="model.phone"
          :label="$t('phone')"
          :rules="[rules.required, rules.phone]"
          required
        />

        <v-date-input
          v-model="model.birthday"
          :label="$t('birthday')"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          clearable
        />

        <v-text-field
          density="compact"
          v-model="model.age"
          type="number"
          :label="$t('age')"
          :rules="[rules.age]"
        />
        <v-select
          density="compact"
          v-model="model.gender"
          :label="$t('sex')"
          :items="genders"
          :item-title="(e) => $t(e)"
          :rules="[rules.required]"
          required
        />

        <v-textarea
          density="compact"
          v-model="model.medical_history"
          :label="$t('medical-history')"
          auto-grow
        />

        <v-date-input
          v-model="model.first_consultation_date"
          :label="$t('first-consultation')"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          required
        ></v-date-input>
      </v-form>
    </v-card-text>

    <template #actions>
      <slot name="actions" :validation="validation" />
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Patient } from '@/models/models'
import { calculateAge } from '@/utils/utils'

const { t } = useI18n()

defineProps<{ title: string }>()

const validation = ref()

const model = defineModel<Patient>({
  default: {
    name: '',
    phone: '',
    age: null,
    birthday: '',
    gender: '',
    medical_history: '',
    first_consultation_date: new Date(),
  },
})

const genders = ['male', 'female']

const rules = {
  required: (v: unknown) => !!v || t('validation.required'),
  name: (v: string) => (!!v && /^[a-zA-Z\u0600-\u06FF\s'-]{2,50}$/.test(v)) || t('validation.name'),
  phone: (v: string) => (!!v && /^\+?\d{7,15}$/.test(v)) || t('validation.phone'),
  gender: (v: string) => !!v || t('validation.gender'),
  age: (v: string) => !!v || t('validation.age'),
}

watchEffect(() => {
  if (!model.value.birthday) return
  model.value.birthday.setHours(12)
  model.value.age = calculateAge(model.value.birthday) ?? 0
})
</script>
