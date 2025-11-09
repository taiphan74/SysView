import { useState, useEffect } from 'react'
import { core } from '@tauri-apps/api'

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
          core.invoke<CpuInfo>('get_cpu_info'),
          core.invoke<GpuInfo>('get_gpu_info'),
          core.invoke<RamInfo>('get_ram_info'),
        ]);
        setCpuInfo(cpu);
        setGpuInfo(gpu);
        setRamInfo(ram);
      } catch (err) {
        console.error('Failed to fetch hardware info:', err);
        setError('Failed to load hardware info');
      }
    }

    fetchHardwareInfo();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2>Hardware Info</h2>

      {/* CPU Info */}
      {cpuInfo ? (
        <div>
          <h3>CPU</h3>
          <p><strong>Name:</strong> {cpuInfo.brand}</p>
          <p><strong>Cores:</strong> {cpuInfo.cores}</p>
          <p><strong>Frequency:</strong> {cpuInfo.frequency} MHz</p>
        </div>
      ) : (
        <p>Loading CPU info...</p>
      )}

      {/* GPU Info */}
      {gpuInfo ? (
        <div style={{ marginTop: '1rem' }}>
          <h3>GPU</h3>
          <p><strong>Name:</strong> {gpuInfo.name}</p>
          <p><strong>Vendor ID:</strong> {gpuInfo.vendor}</p>
          <p><strong>Device ID:</strong> {gpuInfo.device}</p>
          <p><strong>Backend:</strong> {gpuInfo.backend}</p>
        </div>
      ) : (
        <p>Loading GPU info...</p>
      )}

      {/* RAM Info */}
      {ramInfo ? (
        <div style={{ marginTop: '1rem' }}>
          <h3>RAM</h3>
          <p><strong>Total:</strong> {(ramInfo.total / 1024 / 1024).toFixed(2)} GB</p>
          <p><strong>Used:</strong> {(ramInfo.used / 1024 / 1024).toFixed(2)} GB</p>
          <p><strong>Available:</strong> {(ramInfo.available / 1024 / 1024).toFixed(2)} GB</p>
        </div>
      ) : (
        <p>Loading RAM info...</p>
      )}
    </>
  )
}

export default App
