use serde::Serialize;

#[derive(Debug, Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CpuCacheInfo {
    pub l1: Option<String>,
    pub l2: Option<String>,
    pub l3: Option<String>,
}

#[derive(Debug, Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CpuStaticInfo {
    pub brand: Option<String>,
    pub physical_cores: Option<usize>,
    pub sockets: Option<u32>,
    pub virtual_processors: Option<u32>,
    pub virtualization: Option<String>,
    pub base_frequency_mhz: Option<f64>,
    pub governor: Option<String>,
    pub caches: CpuCacheInfo,
}

#[derive(Debug, Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CpuDynamicInfo {
    pub current_frequency_mhz: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CpuInfo {
    pub static_info: CpuStaticInfo,
    pub dynamic_info: CpuDynamicInfo,
}
