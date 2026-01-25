import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import auth from './lib/auth';
import MainLayout from './components/layout/MainLayout';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistPage from './pages/PlaylistPage';
import { LoginForm } from './pages/login';
import RegisterForm from './pages/register';

const queryClient = new QueryClient();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const u = await auth.getMe();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* --- ROUTES PUBLIQUES --- */}
          <Route 
            path="/login" 
            element={!user ? <LoginForm onLogin={() => window.location.href = '/'} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterForm /> : <Navigate to="/" />} 
          />

          {/* --- ROUTES PROTÉGÉES --- */}
          {!user ? (
             <Route path="*" element={<Navigate to="/login" />} />
          ) : (
            <Route element={<MainLayout />}>
              <Route path="/" element={<PlaylistsPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}