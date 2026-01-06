import { AppSidebar } from "@/components/Block/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { FaBars } from "react-icons/fa";
import PlaylistGroup from "./components/Block/playlists/PlaylistGroup";
import { ButtonGroup } from "./components/ui/button-group";
import { Button } from "./components/ui/button";
import { useState } from "react";


export default function App() {
  const [playlistSide, setPlaylistSide] = useState(1)
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
          <div>
            <ButtonGroup>
              <Button variant={"default"} onClick={()=>setPlaylistSide(1)} className={playlistSide==1 ?"bg-red-900 text-white" : "bg-white text-black"}>Imported Playlists</Button>
              <Button variant={"default"} onClick={()=>setPlaylistSide(2)} className={playlistSide==2 ?"bg-red-900 text-white" : "bg-white text-black"}>filtered Playlists</Button>
            </ButtonGroup>
          </div>
          {playlistSide==1 ?
          <PlaylistGroup title="Imported Playlists : "/> :
          <PlaylistGroup title="Filtered Playlists : "/>}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
