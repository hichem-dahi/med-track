import { ref } from 'vue'

import type { Assessment } from '@/models/models'

const defaultForm = (): Assessment => ({
  id: '',
  description: '',
  date: new Date(),
  patient_id: '',
})

const form = ref<Assessment>(defaultForm())

function resetForm() {
  form.value = defaultForm()
}

export { form, resetForm, defaultForm }
