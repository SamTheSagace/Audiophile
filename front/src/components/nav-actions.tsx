import { LogOut } from "lucide-react"
import auth, { logout } from "@/lib/auth"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function NavActions() {

    const handleLogout = () => { auth.logout(); window.location.reload(); }
  
  return (
    <div className="space-y-2">

      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <a href="#" className="flex items-center gap-3" onClick={handleLogout}>
              <LogOut className="size-4" />
              <span>Se déconnecter</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
