use std::{
    collections::VecDeque,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use once_cell::sync::Lazy;
use tauri::command;

use crate::sysinfo::shared::SharedSystem;

const MAX_SAMPLES: usize = 200;

// chia 2 vùng lưu dữ liệu CPU & RAM
static CPU_HISTORY: Lazy<Arc<Mutex<VecDeque<f32>>>> =
    Lazy::new(|| Arc::new(Mutex::new(VecDeque::new())));
static RAM_HISTORY: Lazy<Arc<Mutex<VecDeque<f32>>>> =
    Lazy::new(|| Arc::new(Mutex::new(VecDeque::new())));

/// Chạy nền: đọc CPU + RAM mỗi 500ms
pub fn start_system_thread(system: SharedSystem) {
    let cpu_history = CPU_HISTORY.clone();
    let ram_history = RAM_HISTORY.clone();

    thread::spawn(move || loop {
        {
            let mut sys = system.lock().unwrap();
            sys.refresh_cpu_all();
            sys.refresh_memory();
        }

        thread::sleep(Duration::from_millis(500));

        let (cpu_usage, total, used) = {
            let mut sys = system.lock().unwrap();
            sys.refresh_cpu_all();
            sys.refresh_memory();

            (
                sys.global_cpu_usage(),
                sys.total_memory() as f32,
                sys.used_memory() as f32,
            )
        };

        let ram_usage = if total > 0.0 {
            (used / total) * 100.0
        } else {
            0.0
        };

        {
            let mut c = cpu_history.lock().unwrap();
            c.push_back(cpu_usage);
            if c.len() > MAX_SAMPLES {
                c.pop_front();
            }
        }

        {
            let mut r = ram_history.lock().unwrap();
            r.push_back(ram_usage);
            if r.len() > MAX_SAMPLES {
                r.pop_front();
            }
        }
    });
}

#[command]
pub fn get_cpu_history() -> Vec<f32> {
    CPU_HISTORY.lock().unwrap().iter().cloned().collect()
}

#[command]
pub fn get_cpu_latest() -> Option<f32> {
    CPU_HISTORY.lock().unwrap().back().cloned()
}

#[command]
pub fn get_ram_history() -> Vec<f32> {
    RAM_HISTORY.lock().unwrap().iter().cloned().collect()
}

#[command]
pub fn get_ram_latest() -> Option<f32> {
    RAM_HISTORY.lock().unwrap().back().cloned()
}
