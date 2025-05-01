import { ref } from 'vue'

import type { Appointment } from '@/models/models'

const defaultAppointmentForm = (): Appointment => ({
  patient_id: '',
  description: '',
  start_time: '',
  end_time: '',
  checked: false,
  is_select_time: true,
})

const appointmentForm = ref<Appointment>(defaultAppointmentForm())

function resetAppointmentForm() {
  appointmentForm.value = defaultAppointmentForm()
}

export { appointmentForm, resetAppointmentForm, defaultAppointmentForm }
