"use client";

import * as React from "react";
import {
    SidebarProvider,
} from "@/components/ui/sidebar"; // import từ shadcn/ui
import { HardwareSidebar } from "./components/hardware-sidebar";
import { AppHeader } from "./components/app-header";

interface AppLayoutProps {
    children: React.ReactNode;
    devices?: Array<{ id: string; name: string; desc?: string; value?: string }>;
    activeId?: string;
    onSelectDevice?: (deviceId: string) => void;
    machineName?: string | null;
}

export function AppLayout({
    children,
    devices,
    activeId,
    onSelectDevice,
    machineName,
}: AppLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <HardwareSidebar
                devices={devices}
                activeId={activeId}
                onSelectDevice={onSelectDevice}
            />

            {/* Nội dung chính */}
            <main className="flex flex-1 flex-col">
                <AppHeader machineName={machineName} />
                <div className="flex-1">{children}</div>
            </main>
        </SidebarProvider>
    );
}
