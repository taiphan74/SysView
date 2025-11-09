use serde::Serialize;
use sysinfo::{System, RefreshKind, MemoryRefreshKind};
use tauri::command;

/// Thông tin RAM hiện tại trên hệ thống
#[derive(Serialize)]
pub struct RamInfo {
    pub total: u64,      // Tổng RAM (bytes)
    pub used: u64,       // RAM đang sử dụng (bytes)
    pub available: u64,  // RAM khả dụng (bytes)
}

#[command]
pub fn get_ram_info() -> RamInfo {
    let mut sys = System::new_with_specifics(
        RefreshKind::new().with_memory(MemoryRefreshKind::everything())
    );
    sys.refresh_memory();

    RamInfo {
        total: sys.total_memory(),
        used: sys.used_memory(),
        available: sys.available_memory(),
    }
}
