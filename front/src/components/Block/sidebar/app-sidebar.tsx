import * as React from "react"
import { FaDeezer, FaSpotify, FaYoutube, FaSoundcloud, FaAmazon} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"
import { MusicProvider } from "@/types/provider"
import { NavUser } from "@/components/Block/sidebar/nav-user"
import { NavConnections } from "@/components/Block/sidebar/nav-connections"
import { NavActions } from "@/components/Block/sidebar/nav-actions"
import { useEffect, useState } from 'react';
import auth from '@/lib/auth';
import { type PublicUser } from '@/types/user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

  const providerList = [
      { name: "Apple Music", url: "/provider/apple_music", icon: SiApplemusic, enum: MusicProvider.APPLE_MUSIC },
      { name: "Spotify", url: "/provider/spotify", icon: FaSpotify, enum: MusicProvider.SPOTIFY },
      { name: "YouTube", url: "/provider/youtube", icon: FaYoutube, enum: MusicProvider.YOUTUBE },
      { name: "Deezer", url: "/provider/deezer", icon: FaDeezer, enum: MusicProvider.DEEZER },
      { name: "SoundCloud", url: "/provider/soundcloud", icon: FaSoundcloud, enum: MusicProvider.SOUNDCLOUD },
      { name: "Amazon Music", url: "/provider/amazon_music", icon: FaAmazon, enum: MusicProvider.AMAZON_MUSIC },
    ]
 

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<PublicUser | null>(null)

  useEffect(() => {
    let mounted = true
    auth.getMe()
      .then((u : PublicUser) => { if (mounted) setUser(u) })
      .catch(() => { if (mounted) setUser(null) })
    return () => { mounted = false }
  }, [])

  const alreadyConnectedProviders = user?.connectedAccounts?.map(acc => acc.provider) || []

  const alreadyConnected = providerList.filter(p => alreadyConnectedProviders.includes(p.enum))

  const connectTo = providerList.filter(p => !alreadyConnectedProviders.includes(p.enum))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={user ? { ...user, avatar: user.avatar || '/avatars/shadcn.jpg' } : undefined} />
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3">
          <div className="mt-6">
            <NavConnections connectTo={connectTo} alreadyConnected={alreadyConnected} />
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