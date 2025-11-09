use serde::Serialize;
use sysinfo::{System, CpuRefreshKind, RefreshKind};

/// Thông tin cơ bản của CPU được trả về cho frontend
#[derive(Serialize)]
pub struct CpuInfo {
    brand: String,
    cores: usize,
    frequency: u64,
}

/// Lấy thông tin CPU (tên, số lõi, tần số hiện tại)
#[tauri::command]
pub fn get_cpu_info() -> CpuInfo {
    let mut sys = System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));
    sys.refresh_cpu_all();
    let cpu = sys.cpus().first().expect("Failed to get CPU information");

    CpuInfo {
        brand: cpu.brand().to_string(),
        cores: sys.cpus().len(),
        frequency: cpu.frequency(), // MHz
    }
}
