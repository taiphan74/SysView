use std::{fs, path::Path, process::Command};

use sysinfo::System;

use crate::sysinfo::cpu::model::{CpuCacheInfo, CpuStaticInfo};

const CACHE_BASE_PATH: &str = "/sys/devices/system/cpu/cpu0/cache";
const SCALING_GOVERNOR_PATH: &str = "/sys/devices/system/cpu/cpu0/cpufreq/scaling_governor";

pub fn collect_static_info(system: &System) -> CpuStaticInfo {
    let brand = system
        .cpus()
        .first()
        .map(|cpu| cpu.brand().trim().to_string())
        .filter(|value| !value.is_empty());

    let caches = CpuCacheInfo {
        l1: read_cache_size(0),
        l2: read_cache_size(2),
        l3: read_cache_size(3),
    };

    let governor = read_and_trim(SCALING_GOVERNOR_PATH);
    let lscpu = LscpuSnapshot::gather();

    CpuStaticInfo {
        brand,
        physical_cores: system.physical_core_count(),
        sockets: lscpu.sockets,
        virtual_processors: lscpu.virtual_processors,
        virtualization: lscpu.virtualization,
        base_frequency_mhz: lscpu.base_frequency_mhz,
        governor,
        caches,
    }
}

fn read_cache_size(index: usize) -> Option<String> {
    let path = format!("{CACHE_BASE_PATH}/index{index}/size");
    read_and_trim(&path)
}

fn read_and_trim(path: impl AsRef<Path>) -> Option<String> {
    fs::read_to_string(path)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

#[derive(Default)]
struct LscpuSnapshot {
    base_frequency_mhz: Option<f64>,
    sockets: Option<u32>,
    virtual_processors: Option<u32>,
    virtualization: Option<String>,
}

impl LscpuSnapshot {
    fn gather() -> Self {
        let output = Command::new("lscpu").output();
        let mut snapshot = Self::default();

        if let Ok(output) = output {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                for line in stdout.lines() {
                    if let Some((key, value)) = line.split_once(':') {
                        let key = key.trim();
                        let value = value.trim();
                        match key {
                            "CPU max MHz" if snapshot.base_frequency_mhz.is_none() => {
                                snapshot.base_frequency_mhz = parse_f64(value)
                            }
                            "CPU MHz" if snapshot.base_frequency_mhz.is_none() => {
                                snapshot.base_frequency_mhz = parse_f64(value)
                            }
                            "Socket(s)" => snapshot.sockets = parse_u32(value),
                            "CPU(s)" => snapshot.virtual_processors = parse_u32(value),
                            "Virtualization" => {
                                snapshot.virtualization =
                                    Some(value.to_string()).filter(|v| !v.is_empty())
                            }
                            _ => {}
                        }
                    }
                }
            }
        }

        snapshot
    }
}

fn parse_u32(value: &str) -> Option<u32> {
    value
        .split_whitespace()
        .next()
        .and_then(|part| part.parse::<u32>().ok())
}

fn parse_f64(value: &str) -> Option<f64> {
    value
        .split_whitespace()
        .next()
        .and_then(|part| part.parse::<f64>().ok())
}
