use std::{
    collections::VecDeque,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use once_cell::sync::Lazy;
use sysinfo::{System, RefreshKind, CpuRefreshKind};
use tauri::command;

// lưu tối đa 200 mẫu → nếu lấy mỗi 0.5s thì ~100 giây
const MAX_SAMPLES: usize = 200;

// bộ nhớ chia sẻ toàn cục
static CPU_HISTORY: Lazy<Arc<Mutex<VecDeque<f32>>>> = Lazy::new(|| {
    Arc::new(Mutex::new(VecDeque::new()))
});

/// Hàm này chạy nền, gọi trong .setup(...) của Tauri
pub fn start_cpu_thread() {
    let history = CPU_HISTORY.clone();

    thread::spawn(move || {
        // tạo 1 System riêng để đo CPU
        let mut sys = System::new_with_specifics(
            RefreshKind::new().with_cpu(CpuRefreshKind::everything()),
        );

        loop {
            // đo CPU theo kiểu 2 lần refresh
            sys.refresh_cpu_all();
            thread::sleep(Duration::from_millis(500));
            sys.refresh_cpu_all();

            let usage = sys.global_cpu_usage();

            // lưu vào deque
            let mut guard = history.lock().unwrap();
            guard.push_back(usage);
            if guard.len() > MAX_SAMPLES {
                // xóa mẫu cũ nhất
                guard.pop_front();
            }
        }
    });
}

#[command]
pub fn get_cpu_history() -> Vec<f32> {
    let guard = CPU_HISTORY.lock().unwrap();
    guard.iter().cloned().collect()
}

#[tauri::command]
pub fn get_cpu_latest() -> Option<f32> {
    let guard = CPU_HISTORY.lock().unwrap();
    guard.back().cloned()
}
