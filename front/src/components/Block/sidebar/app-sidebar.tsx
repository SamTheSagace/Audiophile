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
import { MOCK_USER_CONNECTIONS } from '@/data/mock-user';
import type { IconType } from 'react-icons';

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
  const [user, setUser] = useState<{ email?: string; userId?: string; display_name?: string } | null>(null);

  // --- LOGIQUE DYNAMIQUE DES CONNECTIONS ---
  const connectTo: { name: string; url: string; icon: IconType; }[] = [];
  const alreadyConnected: { name: string; url: string; icon: IconType; }[] = [];

  Object.values(ProviderEnum).forEach((provider) => {
    const config = PROVIDERS_CONFIG[provider];
    const isConnected = MOCK_USER_CONNECTIONS[provider]; //TODO Utilise le vrai user.connections plus tard

    const item = {
        name: config.label,
        url: '#', //TODO Mettre l'URL d'auth réelle plus tard : `/api/auth/${provider}`
        icon: config.icon
    };

    if (isConnected) {
        alreadyConnected.push(item);
    } else {
        connectTo.push(item);
    }
  });
  // -----------------------------------------

  useEffect(() => {
    let mounted = true;
    auth.getMe()
      .then(u => { if (mounted) setUser(u as any); })
      .catch(() => { if (mounted) setUser(null); });
    return () => { mounted = false; };
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      
      {/* --- HEADER (USER) --- */}
      <SidebarHeader>
        {user && (
          <NavUser user={{ name: user.display_name || user.email || '', email: user.email || '', avatar: '/avatars/shadcn.jpg' }} />
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
  );
}