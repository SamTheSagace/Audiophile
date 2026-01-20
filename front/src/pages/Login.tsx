import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/pages/login'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm className='w-1/2' onLogin={() => navigate('/dashboard')} />
    </div>
  )
}