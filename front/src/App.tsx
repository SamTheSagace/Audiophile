import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import AppLayout from '@/layouts/AppLayout'

const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Profile = React.lazy(() => import('./pages/Profile'))
const SpotifyCallback = React.lazy(() => import('./pages/SpotifyCallback'))
const Playlists = React.lazy(() => import('./pages/Playlists'))
const Provider = React.lazy(() => import('./pages/Provider'))
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
              <Route path="/playlists" element={<AppLayout><Playlists /></AppLayout>} />
              <Route path="/provider/:provider" element={<AppLayout><Provider /></AppLayout>} />
            </Route>

            <Route path="/spotify/callback" element={<SpotifyCallback />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
