import React from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '@/components/register'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { refresh } = useAuth()

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
      <RegisterForm className='w-1/2' onRegister={async () => { await refresh(); navigate('/dashboard') }} />
    </div>
  )
}
