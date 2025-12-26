import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/core/types'

const STORAGE_KEY = 'app_locale'

/**
 * Available locales with their display names
 */
export const availableLocales: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' }
]

/**
 * Language/locale management composable
 */
export function useLanguage() {
    const { locale, t } = useI18n()

    /**
     * Current locale
     */
    const currentLocale = computed(() => locale.value as Locale)

    /**
     * Current locale info
     */
    const defaultLocale = availableLocales[0]!
    const currentLocaleInfo = computed(() => {
        return availableLocales.find(l => l.code === currentLocale.value) ?? defaultLocale
    })

    /**
     * Set locale and persist to storage
     */
    const setLocale = (newLocale: Locale) => {
        locale.value = newLocale
        localStorage.setItem(STORAGE_KEY, newLocale)
        document.documentElement.lang = newLocale
    }

    /**
     * Initialize locale from storage
     */
    const initLocale = () => {
        const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
        if (stored && availableLocales.some(l => l.code === stored)) {
            locale.value = stored
        }
        document.documentElement.lang = locale.value
    }

    return {
        currentLocale,
        currentLocaleInfo,
        availableLocales,
        setLocale,
        initLocale,
        t
    }
}
