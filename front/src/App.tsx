import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistPage from './pages/PlaylistPage';
import { LoginForm } from './pages/Login';
import { RegisterForm } from './pages/Register';
import ProviderPage from './pages/Provider';
import SettingsPage from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" /> : <Outlet />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            
            {/* --- ROUTES PUBLIQUES (Login/Register) --- */}
            {/* Si connecté -> Redirige vers Home. Sinon -> Affiche la page */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>

            {/* --- ROUTES PROTÉGÉES (App) --- */}
            {/* Si pas connecté -> Redirige vers Login. Sinon -> Affiche l'app */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<PlaylistsPage />} />
                {/* <Route path="/playlists" element={<PlaylistsPage />} /> */}
                <Route path="/playlist/:provider/:id" element={<PlaylistPage />} />
                <Route path="/provider/:provider" element={<ProviderPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Catch-all : Redirige vers l'accueil (qui redirigera vers login si besoin) */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
