import { useState, useEffect } from 'react'
import { core } from '@tauri-apps/api'

interface CpuInfo {
  brand: string;
  cores: number;
  frequency: number;
}

function App() {
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);

  useEffect(() => {
    async function fetchCpuInfo() {
      try {
        const info: CpuInfo = await core.invoke('get_cpu_info');
        setCpuInfo(info);
      } catch (error) {
        console.error("Failed to fetch CPU info:", error);
      }
    }

    fetchCpuInfo();
  }, []);

  return (
    <>
      {cpuInfo ? (
        <div>
          <p><strong>CPU Name:</strong> {cpuInfo.brand}</p>
          <p><strong>Cores:</strong> {cpuInfo.cores}</p>
          <p><strong>Frequency:</strong> {cpuInfo.frequency} MHz</p>
        </div>
      ) : (
        <p>Loading CPU info...</p>
      )}
    </>
  )
}

export default App