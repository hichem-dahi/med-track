import { ref } from 'vue'

import type { Treatment } from '@/models/models'

const defaultForm = (): Treatment => ({
  id: '',
  description: '',
  date: new Date(),
  patient_id: '',
})

const form = ref<Treatment>(defaultForm())

function resetForm() {
  form.value = defaultForm()
}

export { form, resetForm, defaultForm }
