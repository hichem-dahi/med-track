import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PatientsListView from '@/views/PatientsListView.vue'
import PatientDetailsView from '@/views/PatientDetailsView.vue'
import CreatePatientView from '@/views/CreatePatientView.vue'
import ScheduleView from '@/views/ScheduleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/patients-list',
      name: 'PatientsList',
      component: PatientsListView,
    },
    {
      path: '/patient/:id',
      name: 'PatientDetails',
      component: PatientDetailsView,
    },
    {
      path: '/create-patient',
      name: 'CreatePatient',
      component: CreatePatientView,
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: ScheduleView,
    },
  ],
})

export default router
