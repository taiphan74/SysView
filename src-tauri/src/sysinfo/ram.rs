use serde::Serialize;
use tauri::State;

use crate::sysinfo::shared::SharedSystem;

/// Thông tin RAM hiện tại trên hệ thống
#[derive(Serialize)]
pub struct RamInfo {
    pub total: u64,
    pub used: u64,
    pub available: u64,
    pub percent: f32,
}

#[tauri::command]
pub fn get_ram_info(system: State<SharedSystem>) -> RamInfo {
    let mut sys = system.lock().unwrap();
    sys.refresh_memory();

    let total = sys.total_memory();
    let used = sys.used_memory();
    let avail = sys.available_memory();

    let percent = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };

    RamInfo {
        total,
        used,
        available: avail,
        percent,
    }
}
