// Patient.ts
export interface Patient {
  id: string // Unique identifier
  name: string
  birthday: Date | string // ISO date string (e.g. "1990-05-20")
  gender: 'male' | 'female'
  phone: string
  medical_history: string
  assessments?: Assessment[] // Optional, in case you want to embed them
}

// Assessment.ts
export interface Assessment {
  id: string
  patient_id: string
  description: string
  date: Date | string // ISO date string (e.g. "2025-04-20")
}
