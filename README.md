# 🛸 UFO Trạm Gọi Bài

Game web gọi bài ngẫu nhiên cho lớp học, với hiệu ứng 3D UFO bắt học sinh.

## ✨ Tính năng (bản hiện tại)

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
- 🏫 **Nhiều lớp học**: thêm, sửa, xóa, nhân bản lớp; bật/tắt từng học sinh ngay trên phi hành đoàn
- 📚 **Bài học sau khi bị bắt**: flashcards 1–7 thẻ, quiz 4 đáp án, điền khuyết, anagram và unjumble
- 🖼️ **Kho ảnh giáo viên**: kéo-thả PNG/JPG/WebP, nén WebP giữ alpha, thumbnail, dung lượng và xóa có xác nhận
- 💾 **Backup/Restore v2**: một JSON gồm lớp, câu hỏi, cài đặt và ảnh
- 🧘 **Giảm hiệu ứng**: nút ◌ trên thanh đầu trang, ngoài hỗ trợ `prefers-reduced-motion`

## 🌐 Mở game

**Link trực tiếp:** https://aliuliu001.github.io/ufo-tram-goi-bai-2/

Nếu vừa có bản mới mà anh vẫn nhìn thấy giao diện cũ: bấm **Ctrl + Shift + R**.

## 🎯 Cách dùng

1. **Tạo lớp và danh sách**: Bấm **⚙️ Cài đặt** → **Quản lý lớp** hoặc **Danh sách học sinh**; mỗi dòng một tên.
2. **Nạp học liệu**: Trong Cài đặt, mở **Kho ảnh** để nạp ảnh và **Nội dung học** để tạo bài sau khi UFO bắt được bạn.
3. **Backup dữ liệu**: Ở tab **Kho ảnh**, dùng **Backup toàn bộ** trước khi xóa cache hoặc đổi máy.
4. **Chọn skin**: Bấm **🎨 Đổi skin** để chọn UFO và crew.
5. **Điều chỉnh âm thanh/chuyển động**: Bấm **🎵**, **🔊** hoặc **◌**.
6. **Bắt đầu**: Bấm **🚀 Bắt đầu dò tìm** hoặc nhấn **Space**.
7. **Reset**: Bấm **↻ Làm lại lượt** để gọi lại từ đầu.

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

## 📦 Dữ liệu và riêng tư

- Danh sách lớp, câu hỏi và cài đặt lưu trên trình duyệt của giáo viên
- Ảnh lưu ở IndexedDB để tránh giới hạn localStorage
- Skin preferences và audio settings lưu trong `ufo-preferences`
- Backup JSON giúp chuyển dữ liệu sang máy khác hoặc khôi phục sau khi xóa cache
- Không có tên học sinh thật trong mã nguồn GitHub
- Xem [RESTORATION_PLAN.md](RESTORATION_PLAN.md) cho các tính năng sắp tới

## 🛠️ Development

```bash
# Cài đặt
npm install

# Chạy tests (môi trường Node không cần trình duyệt)
node --import tsx --test tests/*.test.js

# Kiểm tra kiểu và build production
npm run lint
npx vite build
```

**Tests hiện tại (40 tests):**
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

## 📋 Tiến độ

Kế hoạch và checklist thực tế nằm ở [plan.md](plan.md) và [task.md](task.md). Các phần còn cần nghiệm thu thủ công: upload 100+ ảnh, backup/restore trên trình duyệt thật, kiểm tra GitHub Pages và trải nghiệm lớp học đầy đủ.

## 📄 License

Educational project - free to use and modify.

---

**Phát triển bởi**: Ngọc Trương + AI Assistant  
**Tech stack**: Vanilla JS, Three.js r128, Web Audio API  
**Deployed**: GitHub Pages
