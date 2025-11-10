export interface CpuCacheInfo {
  l1: string | null
  l2: string | null
  l3: string | null
}

export interface CpuStaticInfo {
  brand: string | null
  physicalCores: number | null
  sockets: number | null
  virtualProcessors: number | null
  virtualization: string | null
  baseFrequencyMhz: number | null
  governor: string | null
  caches: CpuCacheInfo
}

export interface CpuDynamicInfo {
  currentFrequencyMhz: number | null
}

export interface CpuInfo {
  staticInfo: CpuStaticInfo
  dynamicInfo: CpuDynamicInfo
}

export interface RamStaticInfo {
  total: number
  swapTotal: number
  speedMtps: number | null
  slotsUsed: number | null
  slotsAvailable: number | null
  formFactor: string | null
  memType: string | null
}

export interface RamDynamicInfo {
  used: number
  available: number
  percent: number
  swapUsed: number
  swapAvailable: number
}

export interface RamInfo {
  staticInfo: RamStaticInfo
  dynamicInfo: RamDynamicInfo
}
