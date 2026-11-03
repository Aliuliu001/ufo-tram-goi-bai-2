# Danh sách công việc — tái tạo UFO Trạm Gọi Bài 3D

> Trạng thái chỉ được chuyển sang hoàn tất khi đã kiểm tra. Bản cũ trong repo là nền tham khảo kỹ thuật, không phải giao diện đích.

## 0. Khảo sát và định hướng

- [x] Xác nhận URL website gốc và khảo sát giao diện/luồng chơi.
- [x] Xác nhận repo hiện tại đang chứa project khác về UI và cơ chế quiz.
- [x] Viết lại kế hoạch triển khai theo website gốc.
- [x] Chốt phạm vi: cảnh quét hài hước, ngân hàng ảnh/text và ba dạng bài.

## 1. Dữ liệu và luật gọi bài

- [x] 1.1 Tạo model lớp, học sinh, lịch sử chuyến bay và thiết lập.
- [x] 1.2 Thêm nền localStorage với dữ liệu lớp mẫu.
- [ ] 1.3 Nối thêm/sửa/xóa lớp và học sinh vào giao diện mới.
- [ ] 1.4 Nối bật/tắt từng học sinh và Bật tất cả vào giao diện mới.
- [x] 1.5 Cài luật chọn ngẫu nhiên 1/nhiều học sinh, có/không chống trùng.
- [x] 1.6 Cài reset vòng và nhật ký chuyến bay ở tầng domain.
- [x] 1.7 Viết test cho các luật chọn ngẫu nhiên.

## 2. Nội dung học tập

- [ ] 2.1 Model bộ nội dung, câu hỏi và gán bộ cho lớp.
- [ ] 2.2 Thêm SafeStore: IndexedDB ưu tiên, localStorage/memory fallback và migration dữ liệu cũ.\n- [ ] 2.3 Nén PNG/JPG/WebP sang WebP, giữ alpha; chuẩn hóa ID và báo lỗi HEIC/file không hợp lệ.\n- [ ] 2.4 Kho ảnh: kéo-thả, thumbnail, dung lượng/quota, cảnh báo asset thiếu và xóa hàng loạt có xác nhận.\n- [ ] 2.5 Backup/Restore JSON gồm metadata + Base64 ảnh; validate trước restore và ghi ImageDB trước.\n- [ ] 2.6 Model bộ nội dung, câu hỏi và gán bộ cho lớp.\n- [ ] 2.7 Quản lý câu hỏi text/ảnh; kiểm tra dữ liệu trước khi chơi.\n- [ ] 2.8 Flashcards 1–7 thẻ, xác nhận thả xuống khi đúng hết.\n- [ ] 2.9 Quiz: 1 đáp án đúng + 3 đáp án sai, xáo lựa chọn.\n- [ ] 2.10 Điền khuyết, anagram và unjumble.\n- [ ] 2.11 Luồng đúng/thả xuống, sai/thử lại trên UFO.\n- [ ] 2.12 Test upload 100+ ảnh, backup/restore, file sai và SafeStore.
- [ ] 2.3 Quản lý câu hỏi text/ảnh; kiểm tra dữ liệu trước khi chơi.
- [ ] 2.4 Flashcards 1–7 thẻ, xác nhận thả xuống khi đúng hết.
- [ ] 2.5 Quiz: 1 đáp án đúng + 3 đáp án sai, xáo lựa chọn.
- [ ] 2.6 Điền khuyết, anagram và unjumble.
- [ ] 2.7 Luồng đúng/thả xuống, sai/thử lại trên UFO.
- [ ] 2.8 Sao lưu/khôi phục bộ text và ảnh.

## 3. Giao diện chuẩn đích

- [ ] 3.1 Header: logo, nhạc/SFX riêng, hướng dẫn, toàn màn hình.
- [ ] 3.2 Panel chọn lớp và phi hành đoàn.
- [ ] 3.3 Dark mode navy/cyan/lime có hierarchy, focus state và không dùng khối hình thô.
- [ ] 3.4 Sân khấu với HUD trạng thái và ba góc camera.
- [ ] 3.5 Điều khiển số bạn, không gọi trùng, thời gian và bắt đầu lượt.
- [ ] 3.6 Nhật ký chuyến bay, Quản lý lớp, Quản lý nội dung và Chế độ giáo viên.
- [ ] 3.7 Responsive laptop/màn hình hẹp, bàn phím và Giảm hiệu ứng.

## 4. Cảnh 3D và âm thanh

- [ ] 4.1 Dựng UFO, khu phố, cây, bụi, nước, vật cản và nhân vật tự tạo.
- [ ] 4.2 Ba góc camera: toàn cảnh, theo dấu UFO, góc phố.
- [ ] 4.3 Quét: nhạc tăng nhịp, UFO blink, tia sáng quét và mục tiêu bí mật.
- [ ] 4.4 Hành động né tránh: lộn nhào, đào đất, nhảy nước, leo cây, chui bụi, nhảy hàng rào.
- [ ] 4.5 Giới hạn hành động đồng thời/cooldown và giảm hiệu ứng để giữ hiệu năng.
- [ ] 4.6 Chuỗi quét → hút → bài học → thả xuống/thử lại → nhật ký.
- [ ] 4.7 Âm thanh Web Audio bật/tắt ngay được.

## 5. Kiểm thử và phát hành

- [ ] 5.1 Chạy test, type-check, build production và kiểm tra hiệu năng.
- [ ] 5.2 Kiểm thử thủ công ba dạng bài, ảnh lỗi và dữ liệu rỗng.
- [ ] 5.3 Kiểm thử lớp/học sinh, không trùng, reset, reload, âm thanh và Giảm hiệu ứng.
- [ ] 5.4 Cập nhật README và GitHub Pages.
- [ ] 5.5 Xác nhận link phát hành.
