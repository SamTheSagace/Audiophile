import { AppSidebar } from '@/components/Block/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { FaBars } from 'react-icons/fa';
import { ButtonGroup } from './components/ui/button-group';
import { Button } from './components/ui/button';
import { useState } from 'react';
import PlaylistIconGroup from './components/Block/playlists/PlaylistIconGroup';
import PlaylistPage from './components/pages/PlaylistPage';

export default function App() {
  const [playlistSide, setPlaylistSide] = useState(1);
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
          {/* <div>
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
          {playlistSide == 1 ? <PlaylistIconGroup title="Imported Playlists : " /> : <PlaylistIconGroup title="Filtered Playlists : " />} */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
