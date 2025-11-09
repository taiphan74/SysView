"use client";

import * as React from "react";
import { useSidebarStore } from "@/stores/sidebar-store";

type HardwareDevice = {
  id: string;
  name: string;
  desc?: string;
  value?: string;
};

interface HardwareSidebarListProps {
  list: HardwareDevice[];
}

export function HardwareSidebarList({ list }: HardwareSidebarListProps) {
  const { activeId, setActiveId } = useSidebarStore();

  return (
    <div className="flex flex-col gap-2">
      {list.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm text-left transition
              ${isActive ? "bg-primary/10 border-primary" : "bg-background/50 border-border"}
            `}
          >
            {/* placeholder chart */}
            <div className="h-12 w-14 rounded-md border border-primary/30 bg-background/40" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {item.desc ? (
                <p className="text-xs text-muted-foreground truncate">
                  {item.desc}
                </p>
              ) : null}
              {item.value ? (
                <p className="text-xs text-muted-foreground">{item.value}</p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
