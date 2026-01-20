import { LogOut } from "lucide-react"
import auth from "@/lib/auth"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function NavActions() {

    const handleLogout = () => { auth.logout(); globalThis.location.reload(); }
  
  return (
    <div className="space-y-2">

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
