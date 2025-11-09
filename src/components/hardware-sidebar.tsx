"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type HardwareDevice = {
  id: string;
  name: string;
  desc?: string;
};

const DEFAULT_DEVICES: HardwareDevice[] = [
  { id: "cpu", name: "CPU", desc: "Processor" },
  { id: "memory", name: "Memory", desc: "RAM" },
  { id: "gpu-0", name: "GPU 0", desc: "Graphics" },
];

interface HardwareSidebarProps {
  devices?: HardwareDevice[];
}

export function HardwareSidebar({ devices }: HardwareSidebarProps) {
  const list = React.useMemo(() => {
    const source = devices && devices.length > 0 ? devices : DEFAULT_DEVICES;
    const priority = ["cpu", "memory", "ram", "gpu", "gpu-0", "gpu-1"];
    return [...source].sort((a, b) => {
      const ia = priority.findIndex((p) => a.id.toLowerCase().startsWith(p));
      const ib = priority.findIndex((p) => b.id.toLowerCase().startsWith(p));
      const pa = ia === -1 ? 999 : ia;
      const pb = ib === -1 ? 999 : ib;
      return pa - pb;
    });
  }, [devices]);

  return (
    <Sidebar className="border-r bg-background/40">
      <SidebarHeader className="pb-0">
        <h2 className="text-sm font-semibold leading-none tracking-tight">
          Devices
        </h2>
        <p className="text-xs text-muted-foreground">
          System hardware summary
        </p>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Hardware</SidebarGroupLabel>
          <SidebarMenu>
            {list.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton className="justify-between">
                  <span className="truncate">{item.name}</span>
                  {item.desc ? (
                    <span className="text-xs text-muted-foreground">
                      {item.desc}
                    </span>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />
      </SidebarContent>
    </Sidebar>
  );
}