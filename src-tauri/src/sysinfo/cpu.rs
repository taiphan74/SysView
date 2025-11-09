use serde::Serialize;
use tauri::State;

use crate::sysinfo::shared::SharedSystem;

/// Thông tin cơ bản của CPU được trả về cho frontend
#[derive(Serialize)]
pub struct CpuInfo {
    pub brand: String,
    pub cores: usize,
    pub frequency: u64,
}

/// Lấy thông tin CPU (tên, số lõi, tần số)
#[tauri::command]
pub fn get_cpu_info(system: State<SharedSystem>) -> CpuInfo {
    // Mượn System dùng chung
    let sys = system.lock().unwrap();

    let cpu0 = sys
        .cpus()
        .first()
        .expect("Failed to get CPU information");

    CpuInfo {
        brand: cpu0.brand().to_string(),
        cores: sys.cpus().len(),
        frequency: cpu0.frequency(),
    }
}