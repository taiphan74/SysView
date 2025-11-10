import { useEffect } from "react"
import { AppLayout } from "./AppLayout"
import { CPUChart } from "@/components/charts/cpu-chart"
import { RAMChart } from "@/components/charts/ram-chart"
import { SysInfoLayout } from "@/components/sysinfo/sysinfo-layout"
import { CpuInfoPanel } from "@/components/sysinfo/cpu-info-panel"
import { RamInfoPanel } from "@/components/sysinfo/ram-info-panel"
import { formatRamUsage } from "@/algorithms/memory-format"
import { useHardwareStore } from "@/stores/hardware-store"
import { useSidebarStore } from "@/stores/sidebar-store"

export default function App() {
  const { cpuInfo, ramInfo, machineName, fetchHardware, isLoading } =
    useHardwareStore()
  const { devices, activeId, setDevices, setActiveId } = useSidebarStore()

  const cpuBrand = cpuInfo?.staticInfo?.brand ?? undefined
  const ramStatic = ramInfo?.staticInfo
  const ramDynamic = ramInfo?.dynamicInfo
  const coreCount =
    cpuInfo?.staticInfo?.physicalCores ??
    cpuInfo?.staticInfo?.virtualProcessors ??
    undefined
  const frequencyMhz =
    cpuInfo?.dynamicInfo?.currentFrequencyMhz ??
    cpuInfo?.staticInfo?.baseFrequencyMhz ??
    undefined
  const cpuSummary =
    coreCount && frequencyMhz
      ? `${coreCount} cores @ ${(frequencyMhz / 1000).toFixed(2)} GHz`
      : undefined

  // lấy hardware
  useEffect(() => {
    fetchHardware()
  }, [fetchHardware])

  // khi có hardware → push vào sidebar store
  useEffect(() => {
    const nextDevices = [
      {
        id: "cpu",
        name: "CPU",
        desc: cpuBrand,
        value: cpuSummary,
      },
      {
        id: "memory",
        name: "Memory",
        desc: formatRamUsage(ramDynamic?.used, ramStatic?.total) ?? undefined,
        value:
          ramDynamic && typeof ramDynamic.percent === "number"
            ? `${ramDynamic.percent.toFixed(0)}% used`
            : undefined,
      },
    ]
    setDevices(nextDevices)
  }, [cpuInfo, ramInfo, setDevices])

  return (
    <AppLayout
      devices={devices}
      activeId={activeId ?? undefined}
      onSelectDevice={setActiveId}
      machineName={machineName}
    >
      <div className="flex h-full w-full flex-col p-4">
        {isLoading ? (
          <p>Loading hardware info...</p>
        ) : (
          <>
            {activeId === "cpu" && (
              <>
                <h2 className="text-lg font-semibold">
                  {cpuBrand ?? "CPU"}
                </h2>
                <SysInfoLayout
                  className="mt-4 flex-1"
                  chart={<CPUChart />}
                  infoPanel={<CpuInfoPanel data={cpuInfo?.staticInfo} />}
                />
              </>
            )}

            {activeId === "memory" && (
              <>
                <h2 className="text-lg font-semibold">Memory</h2>
                <SysInfoLayout
                  className="mt-4 flex-1"
                  chart={<RAMChart />}
                  infoPanel={<RamInfoPanel data={ramStatic} />}
                />
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
