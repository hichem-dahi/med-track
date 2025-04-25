<template>
  <div class="calendar">
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  type CalendarEventExternal,
} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'

import '@schedule-x/theme-default/dist/index.css'

const props = defineProps<{ events: CalendarEventExternal[] }>()
const emits = defineEmits<{
  (e: 'event', event: CalendarEventExternal): void
}>()
// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  locale: 'fr-FR',
  dayBoundaries: {
    start: '06:00',
    end: '18:00',
  },
  selectedDate: new Date().toISOString().split('T')[0],
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  firstDayOfWeek: 0,
  weekOptions: {
    gridHeight: 500,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    eventOverlap: true,
  },
  plugins: [createEventModalPlugin()],
  callbacks: {
    onDoubleClickEvent(calendarEvent) {
      emits('event', calendarEvent)
    },
  },
})

watchEffect(() => {
  calendarApp.events.set(props.events)
})
</script>
