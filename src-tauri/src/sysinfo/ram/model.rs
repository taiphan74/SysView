use serde::Serialize;

/// RAM mà gần như không đổi trong phiên làm việc.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RamStaticInfo {
    pub total: u64,      // bytes
    pub swap_total: u64, // bytes

    pub speed_mtps: Option<u32>,
    pub slots_used: Option<u8>,
    pub slots_available: Option<u8>,
    pub form_factor: Option<String>,
    pub mem_type: Option<String>,
}

/// RAM thay đổi liên tục.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RamDynamicInfo {
    pub used: u64,      // bytes
    pub available: u64, // bytes
    pub percent: f32,
    pub swap_used: u64,
    pub swap_available: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RamInfo {
    pub static_info: RamStaticInfo,
    pub dynamic_info: RamDynamicInfo,
}
