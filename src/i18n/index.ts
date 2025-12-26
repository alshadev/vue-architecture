import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import id from './locales/id.json'

const STORAGE_KEY = 'app_locale'

/**
 * Get stored locale or default to English
 */
function getStoredLocale(): string {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && ['en', 'id'].includes(stored)) {
        return stored
    }

    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0] || 'en'
    if (['en', 'id'].includes(browserLang)) {
        return browserLang
    }

    return 'en'
}

/**
 * Create i18n instance
 */
const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: getStoredLocale(),
    fallbackLocale: 'en',
    messages: {
        en,
        id
    }
})

export default i18n
