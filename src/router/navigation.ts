import type { MenuGroup } from '@/core/types'

/**
 * Navigation menu configuration with groups
 * Used by AppSidebar to render the menu
 * 
 * Groups can have optional labels - if label is not provided,
 * items render without a section header
 * 
 * Icons are defined as string keys that map to icons.ts
 * Labels are i18n keys
 */
export const menuGroups: MenuGroup[] = [
    // Main navigation (no group label)
    {
        key: 'main',
        items: [
            {
                key: 'dashboard',
                icon: 'home',
                label: 'nav.dashboard',
                route: '/'
            }
        ]
    },

    // Management group
    {
        key: 'management',
        label: 'nav.management',
        items: [
            {
                key: 'users',
                icon: 'users',
                label: 'nav.users',
                route: '/users'
            },
            {
                key: 'reports',
                icon: 'barChart',
                label: 'nav.reports',
                route: '/reports'
            }
        ]
    },

    // System group
    {
        key: 'system',
        label: 'nav.system',
        items: [
            {
                key: 'settings',
                icon: 'settings',
                label: 'nav.settings',
                route: '/settings'
            }
        ]
    }
]

// Flat list for backward compatibility
export const menuItems = menuGroups.flatMap(group => group.items)
