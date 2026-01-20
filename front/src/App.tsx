import { useEffect, useState } from 'react';
import auth from './lib/auth';
import { AppSidebar } from '@/components/Block/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { FaBars } from 'react-icons/fa';
import { ButtonGroup } from './components/ui/button-group';
import { Button } from './components/ui/button';
import PlaylistIconGroup from './components/Block/playlists/PlaylistIconGroup';
import PlaylistPage from './components/pages/PlaylistPage';
import { LoginForm } from './components/pages/login';
import RegisterForm from './components/pages/register';

export default function App() {
  const [playlistSide, setPlaylistSide] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = async () => {
    try {
      const u = await auth.getMe();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (loading) return <div className="p-6">Chargement...</div>;

  if (!user) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          {mode === 'login' ? (
            <LoginForm onLogin={refreshUser} onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onRegister={() => setMode('login')} onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1">
            <FaBars className="h-4 w-4" />
          </SidebarTrigger>
          <div className="font-semibold">Audiophile</div>
        </header>

        <main className="p-4">
          <PlaylistPage id={'1'} />
          <div>
            <ButtonGroup>
              <Button
                variant={'default'}
                onClick={() => setPlaylistSide(1)}
                className={playlistSide == 1 ? 'bg-black text-white' : 'bg-white text-black hover:text-white'}
              >
                Imported Playlists
              </Button>
              <Button
                variant={'default'}
                onClick={() => setPlaylistSide(2)}
                className={playlistSide == 2 ? 'bg-black text-white' : 'bg-white text-black hover:text-white'}
              >
                filtered Playlists
              </Button>
            </ButtonGroup>
          </div>
          {playlistSide == 1 ? <PlaylistIconGroup title="Imported Playlists : " /> : <PlaylistIconGroup title="Filtered Playlists : " />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
