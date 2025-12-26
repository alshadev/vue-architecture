import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    const isSidebarCollapsed = ref(false)
    const isMobileSidebarOpen = ref(false)

    function toggleSidebarCollapse() {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
    }

    function setSidebarCollapsed(value: boolean) {
        isSidebarCollapsed.value = value
    }

    function toggleMobileSidebar() {
        isMobileSidebarOpen.value = !isMobileSidebarOpen.value
    }

    function setMobileSidebarOpen(value: boolean) {
        isMobileSidebarOpen.value = value
    }

    return {
        isSidebarCollapsed,
        isMobileSidebarOpen,
        toggleSidebarCollapse,
        setSidebarCollapsed,
        toggleMobileSidebar,
        setMobileSidebarOpen
    }
})
