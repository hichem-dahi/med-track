import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VDateInput } from 'vuetify/labs/VDateInput'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

export const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
    VCalendar,
    VTimePicker,
    VFileUpload,
  },
  directives,
})
