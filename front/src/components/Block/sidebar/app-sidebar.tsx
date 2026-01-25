import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import auth from '@/lib/auth';
import { Home, ListMusic } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { NavActions } from './nav-actions';
import { NavConnections } from './nav-connections';
import { NavUser } from './nav-user';
import { PROVIDERS_CONFIG } from '@/lib/providers';
import { ProviderEnum } from '@/types/playlist.types';
import type { IconType } from 'react-icons';
import type { PublicUser } from '@/types/user';

// Menu principal de navigation
const mainNavItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Mes Playlists",
    url: "/playlists",
    icon: ListMusic,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [user, setUser] = useState< PublicUser | null>(null);


  useEffect(() => {
    let mounted = true
    auth.getMe()
      .then((u : PublicUser) => { if (mounted) setUser(u) })
      .catch(() => { if (mounted) setUser(null) })
    return () => { mounted = false }
  }, [])

    // --- LOGIQUE DYNAMIQUE DES CONNECTIONS ---
  const connectTo: { name: string; url: string; icon: IconType; }[] = [];
  const alreadyConnected: { name: string; url: string; icon: IconType; }[] = [];

  Object.values(ProviderEnum).forEach((provider) => {
    const config = PROVIDERS_CONFIG[provider];
    const isConnected = user?.connectedAccounts?.some(acc => acc.provider === provider);

    const item = {
        name: config.label,
        url: '/provider/' + config.label.toLowerCase(),
        icon: config.icon
    };

    if (isConnected) {
        alreadyConnected.push(item);
    } else {
        connectTo.push(item);
    }
  });
  // -----------------------------------------

  return (
    <Sidebar collapsible="icon" {...props}>
      
      {/* --- HEADER (USER) --- */}
      <SidebarHeader>
        {user && (
          <NavUser user={user ? { ...user, avatar: user.avatar || '/avatars/shadcn.jpg' } : undefined} />
        )}
      </SidebarHeader>

      <SidebarContent>
        
        {/* --- NAVIGATION PRINCIPALE --- */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* --- CONNECTIONS (DYNAMIQUE) --- */}
        <NavConnections 
            connectTo={connectTo} 
            alreadyConnected={alreadyConnected} 
        />
        
      </SidebarContent>

      <SidebarRail />

      {/* --- FOOTER (ACTIONS) --- */}
      <SidebarFooter>
        <NavActions />
      </SidebarFooter>
    </Sidebar>
  )
}