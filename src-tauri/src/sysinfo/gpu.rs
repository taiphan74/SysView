use serde::Serialize;
use tauri::command;

/// Thông tin GPU lấy từ wgpu (gfx)
#[derive(Serialize)]
pub struct GpuInfo {
    pub name: String,
    pub vendor: u32,
    pub device: u32,
    pub backend: String,
}

/// Lấy thông tin GPU bằng wgpu (gfx info)
#[command]
pub fn get_gpu_info() -> GpuInfo {
    let info = pollster::block_on(async {
        let instance = wgpu::Instance::default();
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions::default())
            .await
            .expect("Failed to find a suitable GPU adapter");
        adapter.get_info()
    });

    GpuInfo {
        name: info.name,
        vendor: info.vendor,
        device: info.device,
        backend: format!("{:?}", info.backend),
    }
}
