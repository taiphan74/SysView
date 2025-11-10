use sysinfo::System;

use crate::sysinfo::ram::model::RamStaticInfo;

pub fn collect_static_info(system: &System) -> RamStaticInfo {
    RamStaticInfo {
        total: system.total_memory(),
        swap_total: system.total_swap(),
        speed_mtps: None,
        slots_used: None,
        slots_available: None,
        form_factor: None,
        mem_type: None,
    }
}
