import type { IconType } from "react-icons";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = {
  name: string;
  url: string;
  icon: IconType;
};

export function NavConnections({
  connectTo,
  alreadyConnected,
}: {
  connectTo: Item[];
  alreadyConnected: Item[];
}) {
  return (
    <div className="space-y-2">
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs tracking-widest text-muted-foreground">
          ALREADY CONNECTED
        </SidebarGroupLabel>
        <SidebarMenu>
          {alreadyConnected.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className="py-5">
                <a href={item.url} className="flex items-center gap-3">
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

      <SidebarGroup>
        <SidebarGroupLabel className="text-xs tracking-widest text-muted-foreground">
          CONNECT TO
        </SidebarGroupLabel>
        <SidebarMenu>
          {connectTo.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className="py-5">
                <a href={item.url} className="flex items-center gap-3">
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
    </div>
  );
}
