# UFO Trạm Gọi Bài - Restoration Plan

Kế hoạch phát triển tiếp theo sau v10.

## 🎯 Phase 1: Offline Support
**Mục tiêu**: Chạy được khi mạng trường yếu

- [ ] Đưa Three.js vào repo (vendor/three.min.js)
- [ ] Service Worker để cache assets
- [ ] Offline indicator trong UI
- [ ] Manifest.json cho PWA

## 📚 Phase 2: Class Management
**Mục tiêu**: Quản lý nhiều lớp và học sinh

- [ ] Multi-class system với localStorage
- [ ] Import/export danh sách học sinh (CSV/JSON)
- [ ] Trạng thái tham gia từng học sinh (có mặt/vắng/muộn)
- [ ] Lịch sử điểm danh theo ngày
- [ ] Phân nhóm học sinh trong lớp

## 🖼️ Phase 3: Student Profiles
**Mục tiêu**: Cá nhân hóa học sinh

- [ ] Ảnh đại diện học sinh (upload hoặc emoji)
- [ ] Lưu ảnh vào IndexedDB (không phụ thuộc localStorage quota)
- [ ] Hiển thị ảnh thay texture trong 3D scene
- [ ] Avatar editor đơn giản

## 💾 Phase 4: Backup & Restore
**Mục tiêu**: Không lo mất dữ liệu

- [ ] Export toàn bộ dữ liệu ra JSON
- [ ] Import JSON để khôi phục
- [ ] Auto-backup hàng ngày vào browser storage
- [ ] Warning khi localStorage gần đầy
- [ ] Sync với Google Drive (optional)

## 📝 Phase 5: Quiz Integration
**Mục tiêu**: Tích hợp câu hỏi vào gameplay

- [ ] Question bank với câu hỏi đúng/sai hoặc trả lời ngắn
- [ ] Học sinh trả lời trước khi UFO bắt
- [ ] Điểm số dựa trên độ chính xác + tốc độ
- [ ] Leaderboard theo buổi học
- [ ] Export kết quả ra Excel

## 📖 Phase 6: Session History
**Mục tiêu**: Nhật ký tiết học

- [ ] Lưu mỗi lần gọi bài (timestamp, students, results)
- [ ] Review lại buổi học trước
- [ ] Stats: tần suất được gọi mỗi học sinh
- [ ] Export report PDF/Excel
- [ ] Teacher notes cho mỗi session

## ⚡ Phase 7: Performance Mode
**Mục tiêu**: Chạy mượt trên laptop yếu

- [ ] Settings: Low/Medium/High graphics
- [ ] Giảm polygon count của 3D models khi Low mode
- [ ] Tắt shadows, giảm particle effects
- [ ] FPS limiter (30fps cho laptop yếu)
- [ ] Auto-detect GPU capability

## 🎨 Phase 8: Stage Templates
**Mục tiêu**: Đa dạng bối cảnh

- [ ] **Neon City**: Cyberpunk với đèn LED, tòa nhà cao tầng
- [ ] **Forest**: Rừng cây, thác nước, động vật hoang dã
- [ ] **Robot Factory**: Nhà máy với băng chuyền, robot arms
- [ ] **Ocean Space**: Đại dương vũ trụ với san hô phát sáng, cá ngoài hành tinh
- [ ] Có thể chọn stage trước mỗi buổi học
- [ ] Custom skybox cho mỗi stage

## 🔐 Phase 9: Teacher Tools
**Mục tiêu**: Công cụ quản lý lớp học

- [ ] Lock settings khi đang scan (tránh học sinh chỉnh)
- [ ] Teacher password (optional)
- [ ] Preset difficulty levels
- [ ] Batch operations: mark all present/absent
- [ ] Quick filters: boys/girls/groups

## 🌐 Phase 10: Multi-language
**Mục tiêu**: Hỗ trợ tiếng Anh

- [ ] i18n system với language picker
- [ ] Tiếng Việt (default) + English
- [ ] Translate UI labels
- [ ] Keep student names untranslated

## 📊 Phase 11: Analytics Dashboard
**Mục tiêu**: Insights cho giáo viên

- [ ] Biểu đồ tần suất gọi bài
- [ ] Participation rate theo tuần/tháng
- [ ] Most/least called students
- [ ] Average response time (nếu có quiz)
- [ ] Export charts as PNG

## 🎮 Phase 12: Gamification
**Mục tiêu**: Tăng engagement

- [ ] XP system: học sinh được gọi = +10 XP
- [ ] Levels: Cadet → Pilot → Captain → Commander
- [ ] Badges: "Perfect Week", "Speed Demon", "Quiz Master"
- [ ] Class leaderboard (optional, có thể tắt)
- [ ] Unlockable crew skins qua achievements

---

## Priority Order

**High (Q1 2027)**
1. Phase 1: Offline Support
2. Phase 2: Class Management
4. Phase 4: Backup & Restore

**Medium (Q2 2027)**
3. Phase 3: Student Profiles
5. Phase 5: Quiz Integration
7. Phase 7: Performance Mode

**Low (Q3+ 2027)**
6. Phase 6: Session History
8. Phase 8: Stage Templates
9-12. Teacher Tools, Multi-language, Analytics, Gamification

---

## Technical Notes

- **Storage Strategy**: IndexedDB for images/large data, localStorage for settings
- **Offline-first**: Service Worker + AppCache fallback
- **Build Tool**: Consider Vite for bundling if project grows
- **Testing**: Playwright for E2E, Vitest for unit tests
- **Accessibility**: Maintain WCAG 2.1 AA throughout all phases

---

**Last updated**: 2026-11-02  
**Current version**: v10
