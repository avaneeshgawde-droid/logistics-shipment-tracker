import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('logitrack_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('logitrack_token') || null
  })

  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('logitrack_user', JSON.stringify(user))
      localStorage.setItem('logitrack_token', token)
    } else {
      localStorage.removeItem('logitrack_user')
      localStorage.removeItem('logitrack_token')
    }
  }, [user, token])

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('logitrack_user')
    localStorage.removeItem('logitrack_token')
  }

  function getAuthHeader() {
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  // Centralized API fetch wrapper with status handling
  async function apiFetch(url, options = {}) {
    setAuthError(null)

    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {})
    }

    const endpoint = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`

    try {
      const response = await fetch(endpoint, { ...options, headers })

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Response body was not JSON
        }

        if (response.status === 401) {
          logout()
          const err = new Error('Session expired or unauthorized. Please log in again.')
          setAuthError(err.message)
          throw err
        }

        if (response.status === 403) {
          const err = new Error('Access denied. You do not have permission for this action.')
          setAuthError(err.message)
          throw err
        }

        if (response.status === 404) {
          throw new Error(errorMessage || 'The requested resource was not found.')
        }

        if (response.status >= 500) {
          throw new Error('Internal server error. Please try again later.')
        }

        throw new Error(errorMessage)
      }

      if (response.status === 204) {
        return null
      }

      return await response.json()
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(`Could not connect to backend server at ${API_BASE_URL}. Ensure Spring Boot service is running.`)
      }
      throw err
    }
  }

  async function login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    })
    setToken(data.token)
    return data
  }

  async function register(name, email, password, role = 'CUSTOMER') {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    })

    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    })
    setToken(data.token)
    return data
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authError,
        login,
        register,
        logout,
        getAuthHeader,
        apiFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
