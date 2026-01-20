import { LogOut, SquareActivity } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import auth from "@/lib/auth";

export function NavActions() {

  const handleLogout = () => { auth.logout(); globalThis.location.reload(); }
  
  return (
    <div className="space-y-2">
      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <a href="/dashboard" className="flex w-full items-center gap-3">
              <SquareActivity className="size-4" />
              <span>Tableau de bord</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <button className="flex items-center gap-3 hover:cursor-pointer" onClick={handleLogout}>
              <LogOut className="size-4" />
              <span>Se déconnecter</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
