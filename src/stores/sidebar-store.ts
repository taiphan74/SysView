import { create } from "zustand"

export interface SidebarDevice {
  id: string
  name: string
  desc?: string
  value?: string
}

interface SidebarState {
  devices: SidebarDevice[]
  activeId: string | null
  setActiveId: (id: string) => void
  setDevices: (devices: SidebarDevice[]) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  devices: [],
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
  setDevices: (devices) =>
    set((state) => ({
      devices,
      activeId: state.activeId ?? (devices[0]?.id ?? null),
    })),
}))
