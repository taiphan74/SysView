use std::sync::{Arc, Mutex};
use sysinfo::{CpuRefreshKind, MemoryRefreshKind, RefreshKind, System};

pub type SharedSystem = Arc<Mutex<System>>;

pub fn build_system_state() -> SharedSystem {
    Arc::new(Mutex::new(System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything()),
    )))
}
