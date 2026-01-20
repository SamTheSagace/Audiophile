import * as React from "react"
import { FaDeezer, FaSpotify, FaYoutube} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"

import { NavUser } from "@/components/nav-user"
import { NavConnections } from "@/components/nav-connections"
import { NavActions } from "@/components/nav-actions"
import { useEffect, useState } from 'react';
import auth from '../lib/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

  const data = {
    connectTo: [
      { name: "Apple Music", url: "#", icon: SiApplemusic },
      { name: "Spotify", url: "#", icon: FaSpotify },
      { name: "YouTube", url: "#", icon: FaYoutube },
    ],
    alreadyConnected: [
      { name: "Deezer", url: "#", icon: FaDeezer },
    ],
  }
 

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{ email?: string; userId?: string; display_name?: string } | null>(null)

  useEffect(() => {
    let mounted = true
    auth.getMe()
      .then((u) => { if (mounted) setUser(u as any) })
      .catch(() => { if (mounted) setUser(null) })
    return () => { mounted = false }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={user ? { name: user.display_name || user.email, email: user.email, avatar: '/avatars/shadcn.jpg' } : undefined} />
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3">
          <div className="mt-6">
            <NavConnections
              connectTo={data.connectTo}
              alreadyConnected={data.alreadyConnected}
            />
          </div>
        </div>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <NavActions />
      </SidebarFooter>
    </Sidebar>
  )
}
