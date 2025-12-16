import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "./components/ui/button";
import { FaBars } from "react-icons/fa";

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
          Hello
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <Button>Click me</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Delete</Button>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
