mod sysinfo;

use crate::sysinfo::shared::{build_system_state, SharedSystem};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(build_system_state())
        .setup(|app| {
            let system = app.state::<SharedSystem>().inner().clone();
            crate::sysinfo::system_monitor::start_system_thread(system);

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // các API info tĩnh
            sysinfo::cpu::get_cpu_info,
            sysinfo::ram::get_ram_info,
            sysinfo::host::get_machine_name,
            // các API realtime từ system_monitor
            sysinfo::system_monitor::get_cpu_history,
            sysinfo::system_monitor::get_cpu_latest,
            sysinfo::system_monitor::get_ram_history,
            sysinfo::system_monitor::get_ram_latest,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
