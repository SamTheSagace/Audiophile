import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { FaBars } from "react-icons/fa";
import PlaylistGroup from "./components/Block/playlists/PlaylistGroup";


export default function App() {
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
          <PlaylistGroup/>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
