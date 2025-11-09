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

function App() {
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);
  const [gpuInfo, setGpuInfo] = useState<GpuInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHardwareInfo() {
      try {
        const [cpu, gpu] = await Promise.all([
          core.invoke<CpuInfo>('get_cpu_info'),
          core.invoke<GpuInfo>('get_gpu_info'),
        ]);
        setCpuInfo(cpu);
        setGpuInfo(gpu);
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
    </>
  )
}

export default App