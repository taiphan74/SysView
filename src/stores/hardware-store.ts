import { create } from "zustand"
import { invoke } from "@tauri-apps/api/core"
import type { CpuInfo, RamInfo } from "@/types/sysinfo"

interface HardwareState {
  cpuInfo: CpuInfo | null
  ramInfo: RamInfo | null
  machineName: string | null
  isLoading: boolean
  fetchHardware: () => Promise<void>
}

export const useHardwareStore = create<HardwareState>((set) => ({
  cpuInfo: null,
  ramInfo: null,
  machineName: null,
  isLoading: false,
  fetchHardware: async () => {
    set({ isLoading: true })
    try {
      const [cpu, ram, deviceName] = await Promise.all([
        invoke<CpuInfo>("get_cpu_info"),
        invoke<RamInfo>("get_ram_info"),
        invoke<string | null>("get_machine_name"),
      ])
      set({
        cpuInfo: cpu,
        ramInfo: ram,
        machineName: deviceName ?? null,
        isLoading: false,
      })
      console.log("[hardware-store] fetched hardware", { cpu, ram, deviceName })
    } catch (err) {
      console.error("Failed to fetch hardware info:", err)
      set({ isLoading: false })
    }
  },
}))
