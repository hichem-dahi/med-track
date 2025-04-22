import { createI18n } from 'vue-i18n'

import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'

export const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'ar',
  messages: {
    fr: fr,
    ar: ar,
  },
})
