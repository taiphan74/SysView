# SysView

SysView là ứng dụng giám sát phần cứng thời gian thực xây dựng bằng React + Vite ở frontend và Tauri (Rust) ở backend. Ứng dụng lấy dữ liệu hệ thống qua thư viện `sysinfo`, lưu lịch sử sử dụng CPU/RAM trong một thread nền và hiển thị chúng bằng biểu đồ tương tác trên desktop hoặc trong trình duyệt.

## Điểm nổi bật
- Giám sát thời gian thực: mỗi 500 ms backend đọc lại CPU/RAM, lưu 200 mẫu để frontend hiển thị vùng biểu đồ Recharts mượt mà.
- Sidebar phần cứng sống động: `HardwareSidebar` hiển thị sparkline mini và chuyển đổi nhanh giữa CPU và Memory, dựa trên dữ liệu từ `useSidebarStore`.
- Thông tin chi tiết: `CpuInfoPanel` và `RamInfoPanel` gom cả số liệu tĩnh (brand, cache, số socket, RAM total/swap) lẫn số liệu động (tần số hiện tại, phần trăm sử dụng).
- Kiến trúc native-first: Tauri chia sẻ `System` state qua `SharedSystem`, thread `system_monitor` push dữ liệu vào `VecDeque`, các lệnh `get_cpu_info`, `get_ram_info`, `get_cpu_history`, … được frontend gọi bằng `@tauri-apps/api`.
- Stack hiện đại: React 19, Zustand, Recharts, Tailwind CSS v4, Radix UI/ shadcn UI cho layout; Rust 2021, `sysinfo`, `tauri-plugin-log` cho phần native.

## Kiến trúc tổng quan
### Frontend (React + Vite)
- `App.tsx` lấy dữ liệu từ `useHardwareStore`, đồng bộ vào sidebar và điều hướng nội dung.
- Các biểu đồ trong `src/components/charts` sử dụng hook `invoke` để tải lịch sử ban đầu và polling điểm mới mỗi giây.
- Toàn bộ trạng thái UI (sidebar, hardware) được quản lý bằng Zustand, tách khỏi logic hiển thị.
- `algorithms/memory-format.ts` chuẩn hóa đơn vị (bytes/KiB → GiB) để kết quả luôn chính xác với phiên bản `sysinfo`.

### Backend (Tauri + Rust)
- `src-tauri/src/sysinfo` chia thành các module `cpu`, `ram`, `host`, `system_monitor`, `shared`.
- `SharedSystem` giữ một đối tượng `sysinfo::System` duy nhất, tránh đọc lặp tài nguyên.
- `system_monitor::start_system_thread` chạy song song, refresh CPU/RAM, tính phần trăm, lưu tối đa 200 mẫu cho mỗi metric.
- Các lệnh `tauri::command` được đăng ký trong `lib.rs` để frontend có thể `invoke` trực tiếp.

### Luồng dữ liệu
1. Frontend mount → `useHardwareStore.fetchHardware()` gọi `get_cpu_info`, `get_ram_info`, `get_machine_name`.
2. Store cập nhật sidebar → người dùng chọn CPU/RAM.
3. Component biểu đồ gọi `get_*_history`, sau đó polling `get_*_latest` để trượt buffer hiển thị.
4. Info panel hiển thị metadata tĩnh đã lấy ban đầu, biểu đồ cập nhật độc lập.

## Cấu trúc thư mục
```text
SysView/
├─ src/                # Frontend React + Vite
│  ├─ components/      # Sidebar, charts, sysinfo panels, UI primitives
│  ├─ stores/          # Zustand stores (hardware, sidebar)
│  ├─ algorithms/      # Thuật toán định dạng/bổ trợ
│  └─ types/           # Kiểu dữ liệu chia sẻ với backend
├─ src-tauri/          # Mã Rust của ứng dụng Tauri
│  ├─ src/sysinfo/     # Thu thập CPU/RAM + thread monitor
│  └─ tauri.conf.json  # Cấu hình Tauri
├─ public/, dist/      # Tài nguyên tĩnh và artifact build
└─ package.json        # Scripts Vite + Tauri
```

## Yêu cầu hệ thống
- Node.js ≥ 20 và npm (hoặc pnpm/yarn tùy chọn).
- Rust toolchain ổn định (theo `rust-version = 1.77.2` trong `Cargo.toml`).
- Các phụ thuộc nền tảng do Tauri yêu cầu (Clang/LLVM trên Linux, Xcode trên macOS, MSVC trên Windows). Tham khảo [Tauri Prerequisites](https://tauri.app/v2/guides/prerequisites/).
- Quyền đọc thông tin hệ thống (Linux cần cho `lscpu`, `/sys/devices`).

## Cài đặt & chạy
### 1. Cài đặt phụ thuộc
```bash
npm install
```

### 2. Chạy giao diện web (HMR)
```bash
npm run dev
```
Mặc định Vite mở tại `http://localhost:5173`.

### 3. Chạy ứng dụng desktop Tauri
```bash
npm run tauri dev
```
Lệnh này build frontend, bundle với Tauri và mở cửa sổ native.

### 4. Build sản phẩm
```bash
# Build frontend (đưa file vào dist/)
npm run build

# Build gói desktop
npm run tauri build
```

### 5. Kiểm tra lint
```bash
npm run lint
```

## Tùy biến & mở rộng
- Thêm thiết bị mới: khai báo `SidebarDevice`, map sang metric command trong `HardwareSidebarList`, tạo chart/panel tương ứng.
- Điều chỉnh tần suất thu thập: cập nhật `intervalMs` trong hook frontend hoặc `Duration` trong `start_system_thread`.
- Hiển thị thêm chỉ số RAM (speed, form factor) bằng cách mở rộng module `ram::static`.
- Kết nối cảnh báo hoặc thông báo: sử dụng `AppHeader` dialog hoặc tạo store mới cho rule.
