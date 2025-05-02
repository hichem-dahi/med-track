// Patient.ts
export interface Patient {
  id?: string // Unique identifier
  name: string
  birthday: Date // ISO date string (e.g. "1990-05-20")
  gender: 'male' | 'female'
  phone: string
  medical_history: string
  first_consultation_date: Date
}

// Assessment.ts
export interface Assessment {
  id: string
  patient_id: string
  description: string
  date: Date // ISO date string (e.g. "2025-04-20")
}

export interface Treatment {
  id: string
  patient_id: string
  description: string
  date: Date // ISO date string (e.g. "2025-04-20")
}

export interface Appointment {
  id?: string
  patient_id: string
  start_time: Date | string // e.g. "2025-04-20T11:00"
  end_time: Date | string // e.g. "2025-04-20T21:00"
  is_select_time: boolean
  description: string
  checked: boolean
}
