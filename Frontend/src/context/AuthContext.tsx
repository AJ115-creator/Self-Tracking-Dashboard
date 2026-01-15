import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'

export interface User {
  id: string
  email: string
  username: string
  age: number
  gender: string
}

interface AuthResponse {
  access_token: string
  user: User
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, age: number, gender: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY_TOKEN = 'vigility_auth_token'
const STORAGE_KEY_USER = 'vigility_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
    const storedUser = localStorage.getItem(STORAGE_KEY_USER)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem(STORAGE_KEY_TOKEN)
        localStorage.removeItem(STORAGE_KEY_USER)
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      const { access_token, user: userData } = response.data

      setToken(access_token)
      setUser(userData)

      localStorage.setItem(STORAGE_KEY_TOKEN, access_token)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData))
    } catch (error) {
      console.error("Sign in failed", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string, age: number, gender: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
        username,
        age,
        gender
      })
      const { access_token, user: userData } = response.data

      setToken(access_token)
      setUser(userData)

      localStorage.setItem(STORAGE_KEY_TOKEN, access_token)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData))
    } catch (error) {
      console.error("Sign up failed", error)
      throw error
    }
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)

    // Optional: Call backend logout if needed, but JWT is stateless
    // api.post('/auth/logout').catch(() => {}) 

    // Redirect logic is usually handled by the protected route wrapper, 
    // but in case we are in a component that needs immediate redirection:
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
