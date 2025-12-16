import * as React from "react"
import { FaDeezer, FaSpotify, FaYoutube} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"

import { NavUser } from "@/components/nav-user"
import { NavConnections } from "@/components/nav-connections"
import { NavActions } from "@/components/nav-actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Jean-Maurice",
    email: "Jm@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>

      <SidebarContent>
        <NavConnections
          connectTo={data.connectTo}
          alreadyConnected={data.alreadyConnected}
        />
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <NavActions />
      </SidebarFooter>
    </Sidebar>
  )
}
