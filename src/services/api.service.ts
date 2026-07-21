const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

/**
 * Base API service for backend communication via HTTP.
 * All commands are dispatched to the Node.js/Prisma backend.
 */
export class ApiService {
  /**
   * Invoke a backend command through the HTTP /invoke endpoint
   */
  static async invoke<T = any>(command: string, args?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json() as T
    } catch (error) {
      console.error(`Error invoking command '${command}':`, error)
      throw error
    }
  }

  static async get<T = any>(command: string, params?: any): Promise<T> {
    return this.invoke<T>(command, params)
  }

  static async post<T = any>(command: string, data?: any): Promise<T> {
    return this.invoke<T>(command, data)
  }

  static async put<T = any>(command: string, data?: any): Promise<T> {
    return this.invoke<T>(command, data)
  }

  static async delete<T = any>(command: string, params?: any): Promise<T> {
    return this.invoke<T>(command, params)
  }
}

export default ApiService
