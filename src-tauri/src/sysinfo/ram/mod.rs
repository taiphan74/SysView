mod dynamic;
pub mod model;
mod r#static;

use tauri::State;

use crate::sysinfo::shared::SharedSystem;
use model::RamInfo;

use dynamic::collect_dynamic_info;
use r#static::collect_static_info;

/// Return both static and dynamic memory information for the frontend.
#[tauri::command]
pub fn get_ram_info(system: State<SharedSystem>) -> RamInfo {
    let mut sys = system.lock().unwrap();

    let static_info = collect_static_info(&sys);
    let dynamic_info = collect_dynamic_info(&mut sys);

    RamInfo {
        static_info,
        dynamic_info,
    }
}
