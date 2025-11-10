"use client"

import * as React from "react"
import { Settings2 } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AppHeaderProps {
  machineName?: string | null
}

export function AppHeader({ machineName }: AppHeaderProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3">
      <SidebarTrigger className="rounded-lg border border-border/80" />

      <div className="flex-1 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Device
        </p>
        <p className="truncate text-base font-semibold">
          {machineName ?? "My System"}
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>System settings</DialogTitle>
            <DialogDescription>
              Configure monitoring preferences and alerts. (Coming soon)
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            We will surface configuration options here later. For now this modal
            just proves the interaction works.
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
