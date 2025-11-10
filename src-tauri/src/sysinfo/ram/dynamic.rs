use sysinfo::System;

use crate::sysinfo::ram::model::RamDynamicInfo;

pub fn collect_dynamic_info(system: &mut System) -> RamDynamicInfo {
    system.refresh_memory();

    let total = system.total_memory();
    let used = system.used_memory();
    let available = system.available_memory();
    let swap_total = system.total_swap();
    let swap_used = system.used_swap();
    let swap_available = swap_total.saturating_sub(swap_used);

    let percent = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };

    RamDynamicInfo {
        used,
        available,
        percent,
        swap_used,
        swap_available,
    }
}
