import React, { createContext, useContext, useEffect, useState } from 'react'
import auth from '../lib/auth'
import type { User } from '@/types/user'

type AuthContextValue = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const u = await auth.getMe()
      setUser(u as User)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    await auth.login(email, password)
    await refresh()
  }

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default useAuth
