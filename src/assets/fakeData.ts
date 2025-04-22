import type { Assessment, Patient } from '@/models/models'

export const patientsData: Patient[] = [
  {
    id: '1',
    name: 'Alice Benali',
    birthday: '1985-03-15',
    gender: 'female',
    phone: '+213612345678',
    medical_history: 'Hypertension, allergic to penicillin.',
  },
  {
    id: '2',
    name: 'Karim Mansouri',
    birthday: '1990-07-22',
    gender: 'male',
    phone: '+213698765432',
    medical_history: 'Diabetic Type 2, smoker.',
  },
  {
    id: '3',
    name: 'Yasmine Bouzid',
    birthday: '1978-11-03',
    gender: 'female',
    phone: '+213655432198',
    medical_history: 'Asthma since childhood.',
    assessments: [],
  },
]

export const assessmentData: Assessment[] = [
  {
    id: 'a3',
    patient_id: '2',
    description: 'Routine check-up. Blood sugar level high.',
    date: '2025-02-15',
  },
  {
    id: 'a1',
    patient_id: '1',
    description: 'Initial consultation. Blood pressure elevated.',
    date: '2025-03-01',
  },
  {
    id: 'a2',
    patient_id: '1',
    description: 'Follow-up. Blood pressure improved with medication.',
    date: '2025-04-01',
  },
]
