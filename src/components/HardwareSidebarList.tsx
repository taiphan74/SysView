"use client";

import * as React from "react";

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
  return (
    <div className="flex flex-col gap-2">
      {list.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2 shadow-sm"
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
        </div>
      ))}
    </div>
  );
}
