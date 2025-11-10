use sysinfo::System;
use tauri::State;

use crate::sysinfo::shared::SharedSystem;

#[tauri::command]
pub fn get_machine_name(_system: State<SharedSystem>) -> Option<String> {
    System::host_name()
}
