import { create } from "zustand"
import { invoke } from "@tauri-apps/api/core"

interface CpuCacheInfo {
  l1: string | null
  l2: string | null
  l3: string | null
}

interface CpuStaticInfo {
  brand: string | null
  physicalCores: number | null
  sockets: number | null
  virtualProcessors: number | null
  virtualization: string | null
  baseFrequencyMhz: number | null
  governor: string | null
  caches: CpuCacheInfo
}

interface CpuDynamicInfo {
  currentFrequencyMhz: number | null
}

interface CpuInfo {
  staticInfo: CpuStaticInfo
  dynamicInfo: CpuDynamicInfo
}

interface RamStaticInfo {
  total: number
  swapTotal: number
  speedMtps: number | null
  slotsUsed: number | null
  slotsAvailable: number | null
  formFactor: string | null
  memType: string | null
}

interface RamDynamicInfo {
  used: number
  available: number
  percent: number
  swapUsed: number
  swapAvailable: number
}

interface RamInfo {
  staticInfo: RamStaticInfo
  dynamicInfo: RamDynamicInfo
}

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
