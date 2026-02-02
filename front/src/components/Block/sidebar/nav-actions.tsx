import { LogOut, SquareActivity } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
export function NavActions() {
  const handleLogout = () => {};
  const { logout } = useAuth();

  return (
    <div className="space-y-2">
      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <Link to="/" className="flex w-full items-center gap-3">
              <SquareActivity className="size-4" />
              <span>Tableau de bord</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="py-5">
            <button
              className="flex w-full items-center gap-3 hover:cursor-pointer hover:text-red-600 transition-colors"
              onClick={logout}
            >
              <LogOut className="size-4" />
              <span>Se déconnecter</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
