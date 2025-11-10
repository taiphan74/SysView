"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { HardwareSidebarList } from "./hardware-sidebar-list";

type HardwareDevice = {
  id: string;
  name: string;
  desc?: string;
  value?: string;
};

const DEFAULT_DEVICES: HardwareDevice[] = [
  { id: "cpu", name: "CPU", desc: "Processor" },
  { id: "memory", name: "Memory", desc: "RAM" },
];

interface HardwareSidebarProps {
  devices?: HardwareDevice[];
  activeId?: string;
  onSelectDevice?: (deviceId: string) => void;
}

export function HardwareSidebar({
  devices,
  activeId,
  onSelectDevice,
}: HardwareSidebarProps) {
  const list = React.useMemo(() => {
    const source = devices && devices.length > 0 ? devices : DEFAULT_DEVICES;
    const priority = ["cpu", "memory", "ram"];
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
          <HardwareSidebarList
            list={list}
            activeId={activeId}
            onSelect={onSelectDevice}
          />
        </SidebarGroup>

        <SidebarSeparator className="my-2" />
      </SidebarContent>
    </Sidebar>
  );
}
