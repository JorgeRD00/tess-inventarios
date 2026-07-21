import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultPrimaryColor = '#2563eb'

export const useUiStore = defineStore('ui', () => {
  const isDark = ref(false)
  const sidebarOpen = ref(true)
  const modalOpen = ref(false)
  const defaultLogo = '/icos/momnitor.jpeg'
  const logo = ref(defaultLogo)
  const primaryColor = ref(defaultPrimaryColor)
  const notification = ref<{
    show: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }>({
    show: false,
    message: '',
    type: 'info'
  })

  const applyPrimaryColor = () => {
    if (typeof document === 'undefined') return
    document.documentElement.style.setProperty('--color-primary', primaryColor.value)
    applyThemeColor()
  }

  const applyThemeColor = () => {
    if (typeof document === 'undefined') return
    const meta = document.getElementById('app-theme-color') as HTMLMetaElement | null
    if (meta) meta.content = primaryColor.value
  }

  const getImageMimeType = (src: string) => {
    if (src.startsWith('data:')) {
      const match = src.match(/^data:([^;]+)/)
      return match ? match[1] : 'image/png'
    }
    const ext = src.split('.').pop()?.toLowerCase()
    const map: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      ico: 'image/x-icon'
    }
    return map[ext || ''] || 'image/png'
  }

  const applyLogoAsAppIcon = () => {
    if (typeof document === 'undefined') return
    const favicon = document.getElementById('app-favicon') as HTMLLinkElement | null
    if (favicon) {
      favicon.href = logo.value
      favicon.type = getImageMimeType(logo.value)
    }
    const appleIcon = document.getElementById('app-apple-icon') as HTMLLinkElement | null
    if (appleIcon) appleIcon.href = logo.value
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()

    const savedLogo = localStorage.getItem('logo')
    if (savedLogo) {
      logo.value = savedLogo
    }

    const savedColor = localStorage.getItem('primaryColor')
    if (savedColor) {
      primaryColor.value = savedColor
    }
    applyPrimaryColor()
    applyLogoAsAppIcon()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const showModal = () => {
    modalOpen.value = true
  }

  const hideModal = () => {
    modalOpen.value = false
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    notification.value = {
      show: true,
      message,
      type
    }
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  const setLogo = (src: string) => {
    logo.value = src
    localStorage.setItem('logo', src)
    applyLogoAsAppIcon()
  }

  const resetLogo = () => {
    logo.value = defaultLogo
    localStorage.removeItem('logo')
    applyLogoAsAppIcon()
  }

  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    localStorage.setItem('primaryColor', color)
    applyPrimaryColor()
  }

  const resetPrimaryColor = () => {
    primaryColor.value = defaultPrimaryColor
    localStorage.removeItem('primaryColor')
    applyPrimaryColor()
  }

  return {
    isDark,
    sidebarOpen,
    modalOpen,
    logo,
    defaultLogo,
    primaryColor,
    notification,
    initializeTheme,
    toggleTheme,
    toggleSidebar,
    showModal,
    hideModal,
    showNotification,
    setLogo,
    resetLogo,
    setPrimaryColor,
    resetPrimaryColor
  }
})
