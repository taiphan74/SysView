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
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to load hardware info");
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
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">
            {cpuInfo ? cpuInfo.brand : "CPU Usage"}
          </h2>

          {/* === Biểu đồ CPU === */}
          <CPUChart />

          {/* (Optionally) thông tin tóm tắt */}
          {cpuInfo && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Cores: {cpuInfo.cores}</span>
              <span>Frequency: {cpuInfo.frequency} MHz</span>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

export default App;
