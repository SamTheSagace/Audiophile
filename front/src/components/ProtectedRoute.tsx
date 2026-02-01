import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export default ProtectedRoute
