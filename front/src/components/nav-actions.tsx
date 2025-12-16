import { LogOut, UserPlus } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function NavActions() {
  return (
    <div className="space-y-2">
      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <a href="#" className="flex w-full items-center gap-3">
              <UserPlus className="size-4" />
              <span>Invite Friends</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <a href="#" className="flex items-center gap-3">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
