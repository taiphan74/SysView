use sysinfo::System;

use crate::sysinfo::cpu::model::CpuDynamicInfo;

pub fn collect_dynamic_info(system: &mut System) -> CpuDynamicInfo {
    system.refresh_cpu_all();

    let frequency = system.cpus().first().map(|cpu| cpu.frequency());

    CpuDynamicInfo {
        current_frequency_mhz: frequency,
    }
}
