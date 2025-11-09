// src/App.tsx
import { useState, useEffect } from "react";
import { core } from "@tauri-apps/api";
import { AppLayout } from "./AppLayout";
import { CPUChart } from "@/components/CPUChart";

interface CpuInfo {
  brand: string;
  cores: number;
  frequency: number;
}

interface GpuInfo {
  name: string;
  vendor: number;
  device: number;
  backend: string;
}

interface RamInfo {
  total: number;
  used: number;
  available: number;
}

function App() {
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);
  const [gpuInfo, setGpuInfo] = useState<GpuInfo | null>(null);
  const [ramInfo, setRamInfo] = useState<RamInfo | null>(null);
  const error: string | null = null;

  useEffect(() => {
    async function fetchHardwareInfo() {
      try {
        const [cpu, gpu, ram] = await Promise.all([
          core.invoke<CpuInfo>("get_cpu_info"),
          core.invoke<GpuInfo>("get_gpu_info"),
          core.invoke<RamInfo>("get_ram_info"),
        ]);
        setCpuInfo(cpu);
        setGpuInfo(gpu);
        setRamInfo(ram);
      } catch (err) {
        console.error("Failed to fetch hardware info:", err);
      }
    }

    fetchHardwareInfo();
  }, []);

  // sidebar devices
  const devices = [
    {
      id: "cpu",
      name: cpuInfo ? cpuInfo.brand : "CPU",
      desc: cpuInfo ? `${cpuInfo.cores} cores` : undefined,
    },
    {
      id: "memory",
      name: "Memory",
      desc: ramInfo
        ? `${(ramInfo.total / 1024 / 1024).toFixed(1)} GB total`
        : undefined,
    },
    {
      id: "gpu-0",
      name: gpuInfo ? gpuInfo.name : "GPU",
      desc: gpuInfo ? gpuInfo.backend : undefined,
    },
  ];

  return (
    <AppLayout devices={devices}>
      <div className="flex h-full min-h-screen w-full flex-col p-4">
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold">
              {cpuInfo ? cpuInfo.brand : "CPU Usage"}
            </h2>
            <CPUChart className="mt-4 flex-1" />
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default App;
