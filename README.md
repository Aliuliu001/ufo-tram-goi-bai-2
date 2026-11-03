# 🛸 UFO Trạm Gọi Bài

Game web gọi bài ngẫu nhiên cho lớp học, với hiệu ứng 3D UFO bắt học sinh.

## ✨ Tính năng (v10)

- 🎮 **Gọi bài ngẫu nhiên** với hiệu ứng UFO săn đuổi 3D
- 🎬 **Slow-motion** khi UFO khóa mục tiêu - nhìn rõ động tác tránh
- 🚀 **4 UFO variants**: Scout, Rescue (pods), Treasure (energy rings), Storm (fins + core)
- 👥 **4 Crew skins**: Astronaut, Animals, Forest (tree sprites), Robots
- 🎵 **Âm thanh tách biệt**: Nhạc nền ambient + Hiệu ứng âm thanh
- 🎨 **Skin system**: Chọn độc lập UFO và crew, lưu preferences
- 📱 **Responsive**: Tự động adapt layout màn hình nhỏ (<930px)
- ⚡ **UFO hunting phases**: Quét → Phát hiện → Khóa (slow-mo) → Hút
- 🔄 **Reset-safe**: SequenceId pattern ngăn callback cũ chạy nhầm
- ♿ **Accessible**: Focus visible, ARIA labels, keyboard navigation

## 🌐 Mở game

**Link trực tiếp:** https://aliuliu001.github.io/ufo-tram-goi-bai/?v=10

Nếu vừa có bản mới mà anh vẫn nhìn thấy giao diện cũ: bấm **Ctrl + Shift + R**.

## 🎯 Cách dùng

1. **Chỉnh danh sách**: Bấm **⚙️ Chỉnh danh sách**, xóa danh sách mẫu và dán tên học sinh (mỗi dòng một tên).
2. **Chọn skin**: Bấm **🎨 Đổi skin** để chọn UFO và crew.
3. **Điều chỉnh âm thanh**: Bấm **🎵** (nhạc nền) hoặc **🔊** (hiệu ứng) để bật/tắt.
4. **Bắt đầu**: Bấm **🚀 Bắt đầu dò tìm** hoặc nhấn **Space**.
5. **Reset**: Bấm **↻ Làm lại lượt** để gọi lại từ đầu.

## 🎨 Skin Options

**UFO Skins:**
- 🛸 **Thám hiểm Sao Mộc** (Jupiter Scout) - UFO cơ bản
- 🚁 **Đội cứu hộ Ngân Hà** (Rescue) - Có rescue pods hai bên + beacon đỏ
- 💎 **Thợ săn kho báu** (Treasure) - Ba vòng năng lượng xoay
- ⚡ **Chiến binh Bão Tố** (Storm) - Fins sắc nhọn + glowing core

**Crew Skins:**
- 👨‍🚀 **Phi hành gia** - Bộ đồ vũ trụ chuẩn với visor xanh
- 🐱 **Biệt đội động vật** - Tai, mõm, đuôi đáng yêu
- 🌳 **Tinh linh rừng xanh** - Thân cây với tán lá xanh tươi
- 🤖 **Đội robot tự động** - Thân kim loại, màn hình, antenna

## 🎵 Audio System

- **🎵 Nhạc nền**: Ambient drone nhẹ nhàng (3-layer oscillator synthesis)
- **🔊 Hiệu ứng âm**: 
  - Beep dò quét (tần số tăng theo intensity)
  - Nhịp bass + lead tăng dần khi scan
  - Reveal fanfare khi công bố kết quả
- Tất cả tạo bằng **Web Audio API** - không cần tải MP3
- Trạng thái lưu vào `localStorage` key `ufo-preferences`

## 📦 Dữ liệu

- Danh sách học sinh lưu trong `localStorage` của trình duyệt
- Skin preferences và audio settings lưu trong `ufo-preferences`
- Không có tên học sinh thật trong mã nguồn GitHub
- Xem [RESTORATION_PLAN.md](RESTORATION_PLAN.md) cho các tính năng sắp tới

## 🛠️ Development

```bash
# Cài đặt
npm install

# Chạy tests
npm test

# Kiểm tra syntax
npm run check
```

**Tests hiện tại (19 tests):**
- Game engine: gọi đúng logic, không trùng
- Movement: speed cân bằng, escape actions
- Skin catalog: 4 UFO + 4 crew, IDs unique, fallback safe
- Audio: exports đúng functions
- Abduction: progress 0→1 trong thời gian lift

## 📁 Cấu trúc

```
/
├── index.html              # Entry point
├── css/
│   ├── app.css            # Main styles
│   └── recovery.css       # v10 responsive + accessibility
├── js/
│   ├── app.js             # UI controller
│   ├── scene3d.js         # Three.js 3D world + crew rendering
│   ├── skin-catalog.js    # UFO + crew skin definitions
│   ├── suspense-sound.js  # Web Audio API music + SFX
│   ├── game-engine.js     # Random selection logic
│   ├── scan-round.js      # Scan target selection
│   ├── movement-profile.js# Speed + escape actions
│   └── world3d-state.js   # Abduction progress
└── tests/                 # Node test suite
```

## 🚀 Version History

- **v10** (2026-11-02): Skin catalog, audio split, crew variants (forest/robots), reset-safe
- **v9**: Slow-motion + UFO 4-phase hunting + escape actions
- **v8**: Increased intensity, more beam lines, wobbling
- **v7**: Stronger music beats, brighter beam, 3-direction split
- **v5-v6**: Camera modes, street view, animal crew skin
- **v1-v4**: Initial 3D world, basic UFO mechanics

## 📋 Roadmap

Xem chi tiết trong [RESTORATION_PLAN.md](RESTORATION_PLAN.md):

**High Priority:**
- Offline support (Three.js vendored, Service Worker)
- Multi-class management
- Backup/restore JSON

**Medium Priority:**
- Student profiles with IndexedDB images
- Quiz integration
- Performance mode for weak laptops

**Low Priority:**
- Session history & analytics
- Stage templates (Neon, Forest, Robot, Ocean)
- Gamification (XP, badges, unlockables)

## 📄 License

Educational project - free to use and modify.

---

**Phát triển bởi**: Ngọc Trương + AI Assistant  
**Tech stack**: Vanilla JS, Three.js r128, Web Audio API  
**Deployed**: GitHub Pages
