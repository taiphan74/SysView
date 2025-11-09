import { create } from "zustand"
import { invoke } from "@tauri-apps/api/core"

interface CpuInfo {
  brand: string
  cores: number
  frequency: number
}

interface RamInfo {
  total: number
  used: number
  available: number
}

interface HardwareState {
  cpuInfo: CpuInfo | null
  ramInfo: RamInfo | null
  isLoading: boolean
  fetchHardware: () => Promise<void>
}

export const useHardwareStore = create<HardwareState>((set) => ({
  cpuInfo: null,
  ramInfo: null,
  isLoading: false,
  fetchHardware: async () => {
    set({ isLoading: true })
    try {
      const [cpu, ram] = await Promise.all([
        invoke<CpuInfo>("get_cpu_info"),
        invoke<RamInfo>("get_ram_info"),
      ])
      set({ cpuInfo: cpu, ramInfo: ram, isLoading: false })
      console.log("[hardware-store] fetched hardware", { cpu, ram })
    } catch (err) {
      console.error("Failed to fetch hardware info:", err)
      set({ isLoading: false })
    }
  },
}))
