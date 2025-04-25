import { ref, watch } from 'vue'
import { injectPGlite } from '@electric-sql/pglite-vue'
import { format } from 'date-fns'

import type { Appointment } from '@/models/models'

export function useIsoverlappingDate() {
  const db = injectPGlite()

  const existingAppointments = ref<Appointment[]>([])
  const overlappingAppointments = ref<Appointment[]>([])
  const currentAppt = ref<Appointment>()
  const date = ref<Date>()

  watch(
    [date, currentAppt],
    async ([newDate, appt]) => {
      if (!newDate || !db) return

      const isoDate = format(newDate, 'yyyy-MM-dd')
      const query = appt?.id
        ? `SELECT * FROM appointments WHERE DATE(start_time) = $1 AND id != $2`
        : `SELECT * FROM appointments WHERE DATE(start_time) = $1`

      const params = appt?.id ? [isoDate, appt.id] : [isoDate]

      const { rows } = await db.query(query, params)
      existingAppointments.value = rows as Appointment[]
    },
    { immediate: true },
  )

  function isOverlapping(
    startA: Date | string,
    endA: Date | string,
    startB: Date | string,
    endB: Date | string,
  ) {
    return startA < endB && endA > startB
  }

  const noOverlap = (newStart: Date | string, newEnd: Date | string) => {
    overlappingAppointments.value = []
    const hasConflict = existingAppointments.value.some((appt) => {
      const isOverlapped = isOverlapping(
        new Date(newStart).toISOString(),
        new Date(newEnd).toISOString(),
        new Date(appt.start_time).toISOString(),
        new Date(appt.end_time).toISOString(),
      )
      //REFACTOR
      if (isOverlapped) overlappingAppointments.value.push(appt)
      return isOverlapped
    })

    return !hasConflict || 'Time slot already taken'
  }

  return {
    date,
    overlappingAppointments,
    currentAppt,
    noOverlap,
  }
}
