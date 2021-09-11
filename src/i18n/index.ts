import { createI18n } from 'vue-i18n'

const loadMessages = () => {
  const locales = require.context('@/i18n/locales', true, /[\w-]+\.json$/i)
  return locales.keys().reduce((locs, loc) => ({ ...locs, [loc.replace(/\.|\/|json/g, '')]: locales(loc) }), {})
}

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadMessages()
})