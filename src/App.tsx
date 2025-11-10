import { useEffect } from "react"
import { AppLayout } from "./AppLayout"
import { CPUChart } from "@/components/cpu-chart"
import { RAMChart } from "@/components/ram-chart"
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
    const formatGiB = (value?: number | null) =>
      typeof value === "number"
        ? `${(value / 1024 / 1024).toFixed(1)}`
        : undefined
    const ramUsedGiB = formatGiB(ramDynamic?.used)
    const ramTotalGiB = formatGiB(ramStatic?.total)

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
        desc:
          ramUsedGiB && ramTotalGiB
            ? `${ramUsedGiB} / ${ramTotalGiB} GiB`
            : undefined,
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
      <div className="flex h-full min-h-screen w-full flex-col p-4">
        {isLoading ? (
          <p>Loading hardware info...</p>
        ) : (
          <>
            {activeId === "cpu" && (
              <>
                <h2 className="text-lg font-semibold">
                  {cpuBrand ?? "CPU"}
                </h2>
                <CPUChart className="mt-4 flex-1" />
              </>
            )}

            {activeId === "memory" && (
              <>
                <h2 className="text-lg font-semibold">Memory</h2>
                <RAMChart className="mt-4 flex-1" />
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
