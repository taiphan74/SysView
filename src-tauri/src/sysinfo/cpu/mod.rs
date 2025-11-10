mod dynamic;
pub mod model;
mod r#static;

use tauri::State;

use crate::sysinfo::shared::SharedSystem;
use model::CpuInfo;

use dynamic::collect_dynamic_info;
use r#static::collect_static_info;

/// Aggregates static (rarely changing) and dynamic (frequently changing) CPU data.
#[tauri::command]
pub fn get_cpu_info(system: State<SharedSystem>) -> CpuInfo {
    let mut sys = system.lock().unwrap();

    let static_info = collect_static_info(&sys);
    let dynamic_info = collect_dynamic_info(&mut sys);

    CpuInfo {
        static_info,
        dynamic_info,
    }
}
