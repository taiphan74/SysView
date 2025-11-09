mod sysinfo;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            crate::sysinfo::cpu_monitor::start_cpu_thread();

            if cfg!(debug_assertions) {
                _app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            sysinfo::cpu::get_cpu_info,
            sysinfo::gpu::get_gpu_info,
            sysinfo::ram::get_ram_info,
            sysinfo::cpu_monitor::get_cpu_history,
            sysinfo::cpu_monitor::get_cpu_latest,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
