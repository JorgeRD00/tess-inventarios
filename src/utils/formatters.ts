/**
 * Format currency values
 */
export const formatCurrency = (value: number, locale = 'es-MX', currency = 'MXN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format date values
 */
export const formatDate = (date: string | Date, locale = 'es-MX'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date, locale = 'es-MX'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Format number with thousands separator
 */
export const formatNumber = (value: number, locale = 'es-MX'): string => {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
