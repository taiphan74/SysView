// src/App.tsx
import { useState, useEffect } from "react";
import { core } from "@tauri-apps/api";
import { AppLayout } from "./AppLayout";

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

  // danh sách device để đưa xuống sidebar
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
    // bạn muốn thì thêm NVMe, Wireless...
    { id: "nvme", name: "NVMe" },
    { id: "wireless", name: "Wireless (wlp2s0)" },
  ];

  return (
    <AppLayout devices={devices}>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Hardware Info</h2>

          {/* CPU */}
          {cpuInfo ? (
            <div className="space-y-1">
              <h3 className="font-medium">CPU</h3>
              <p>
                <strong>Name:</strong> {cpuInfo.brand}
              </p>
              <p>
                <strong>Cores:</strong> {cpuInfo.cores}
              </p>
              <p>
                <strong>Frequency:</strong> {cpuInfo.frequency} MHz
              </p>
            </div>
          ) : (
            <p>Loading CPU info...</p>
          )}

          {/* GPU */}
          {gpuInfo ? (
            <div className="space-y-1">
              <h3 className="font-medium">GPU</h3>
              <p>
                <strong>Name:</strong> {gpuInfo.name}
              </p>
              <p>
                <strong>Vendor ID:</strong> {gpuInfo.vendor}
              </p>
              <p>
                <strong>Device ID:</strong> {gpuInfo.device}
              </p>
              <p>
                <strong>Backend:</strong> {gpuInfo.backend}
              </p>
            </div>
          ) : (
            <p>Loading GPU info...</p>
          )}

          {/* RAM */}
          {ramInfo ? (
            <div className="space-y-1">
              <h3 className="font-medium">RAM</h3>
              <p>
                <strong>Total:</strong>{" "}
                {(ramInfo.total / 1024 / 1024).toFixed(2)} GB
              </p>
              <p>
                <strong>Used:</strong>{" "}
                {(ramInfo.used / 1024 / 1024).toFixed(2)} GB
              </p>
              <p>
                <strong>Available:</strong>{" "}
                {(ramInfo.available / 1024 / 1024).toFixed(2)} GB
              </p>
            </div>
          ) : (
            <p>Loading RAM info...</p>
          )}
        </div>
      )}
    </AppLayout>
  );
}

export default App;
