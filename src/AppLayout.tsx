"use client";

import * as React from "react";
import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"; // import từ shadcn/ui
import { HardwareSidebar } from "./components/hardware-sidebar";

interface AppLayoutProps {
    children: React.ReactNode;
    devices?: Array<{ id: string; name: string; desc?: string }>;
}

export function AppLayout({ children, devices }: AppLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <HardwareSidebar devices={devices} />

            {/* Nội dung chính */}
            <main className="flex-1">
                <SidebarTrigger className="" />
                {children}
            </main>
        </SidebarProvider>
    );
}