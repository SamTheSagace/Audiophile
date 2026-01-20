import type { IconType } from 'react-icons'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

type Item = {
    name: string
    url: string
    icon: IconType
}

const connectedServicesComponent = (alreadyConnected: Item[]) => {
    if (alreadyConnected.length === 0) {
        return (
            <SidebarGroup>
                <SidebarGroupLabel className="text-md tracking-widest">
                    Services connectés
                </SidebarGroupLabel>
                <div className="ml-4 text-sm text-muted-foreground">
                    Aucun service connecté
                </div>
            </SidebarGroup>
        )
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-md tracking-widest">
                Services connectés
            </SidebarGroupLabel>
            <SidebarMenu>
                {alreadyConnected.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild className="py-5">
                            <a
                                href={item.url}
                                className="flex items-center gap-3"
                            >
                                <span className="flex size-7 items-center justify-center rounded-full bg-muted/30">
                                    <item.icon className="size-4" />
                                </span>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

const connectServicesComponent = (connectTo: Item[]) => {
    if (connectTo.length === 0) {
        return (
            <SidebarGroup>
                <SidebarGroupLabel className="text-md tracking-widest">
                    Services connectables
                </SidebarGroupLabel>
                <div className="ml-4 text-sm text-muted-foreground">
                    Tous les services sont connectés
                </div>
            </SidebarGroup>
        )
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-md tracking-widest">
                Services connectables
            </SidebarGroupLabel>
            <SidebarMenu>
                {connectTo.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild className="py-5">
                            <a
                                href={item.url}
                                className="flex items-center gap-3"
                            >
                                <span className="flex size-7 items-center justify-center rounded-full bg-muted/30">
                                    <item.icon className="size-4" />
                                </span>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export function NavConnections({
    connectTo,
    alreadyConnected,
}: {
    connectTo: Item[]
    alreadyConnected: Item[]
}) {
    return (
        <div className="space-y-2">
            {connectedServicesComponent(alreadyConnected)}
            {connectServicesComponent(connectTo)}
        </div>
    )
}
