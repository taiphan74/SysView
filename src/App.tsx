import { useEffect } from "react"
import { AppLayout } from "./AppLayout"
import { CPUChart } from "@/components/cpu-chart"
import { RAMChart } from "@/components/ram-chart"
import { useHardwareStore } from "@/stores/hardware-store"
import { useSidebarStore } from "@/stores/sidebar-store"

export default function App() {
  const { cpuInfo, ramInfo, fetchHardware, isLoading } = useHardwareStore()
  const { devices, activeId, setDevices, setActiveId } = useSidebarStore()

  // lấy hardware
  useEffect(() => {
    fetchHardware()
  }, [fetchHardware])

  // khi có hardware → push vào sidebar store
  useEffect(() => {
    const nextDevices = [
      {
        id: "cpu",
        name: cpuInfo?.brand ?? "CPU",
        desc: cpuInfo ? `${cpuInfo.cores} cores` : undefined,
      },
      {
        id: "memory",
        name: "Memory",
        desc: ramInfo
          ? `${(ramInfo.total / 1024 / 1024).toFixed(1)} GB total`
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
    >
      <div className="flex h-full min-h-screen w-full flex-col p-4">
        {isLoading ? (
          <p>Loading hardware info...</p>
        ) : (
          <>
            {activeId === "cpu" && (
              <>
                <h2 className="text-lg font-semibold">
                  {cpuInfo?.brand ?? "CPU"}
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
