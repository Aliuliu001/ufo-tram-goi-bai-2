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
- [x] 1.3 Nối thêm/sửa/xóa lớp và học sinh vào giao diện mới.
- [x] 1.4 Nối bật/tắt từng học sinh và Bật tất cả vào giao diện mới.
- [x] 1.5 Cài luật chọn ngẫu nhiên 1/nhiều học sinh, có/không chống trùng.
- [x] 1.6 Cài reset vòng và nhật ký chuyến bay ở tầng domain.
- [x] 1.7 Viết test cho các luật chọn ngẫu nhiên.

## 2. Nội dung học tập

- [x] 2.1 Model bộ nội dung, câu hỏi và gán bộ cho lớp.
- [~] 2.2 SafeStore: IndexedDB cho kho ảnh; fallback và migration còn cần test trên trình duyệt chặn storage.
- [x] 2.3 Nén PNG/JPG/WebP sang WebP, giữ alpha, chuẩn hóa ID và báo file không hợp lệ.
- [x] 2.4 Kho ảnh: kéo-thả, thumbnail, dung lượng/quota và xóa từng ảnh hoặc toàn bộ có xác nhận.
- [x] 2.5 Backup/Restore v2: lớp, câu hỏi, cài đặt, metadata + Base64 ảnh; validate trước restore và ghi ImageDB trước.
- [x] 2.6 Quản lý câu hỏi text/ảnh; kiểm tra dữ liệu trước khi chơi.
- [x] 2.7 Flashcards 1–7 thẻ, xác nhận thả xuống khi đúng hết.
- [x] 2.8 Quiz: 1 đáp án đúng + 3 đáp án sai, xáo lựa chọn.
- [x] 2.9 Điền khuyết, anagram và unjumble.
- [x] 2.10 Luồng đúng/thả xuống, sai/thử lại trên UFO.
- [ ] 2.11 Kiểm thử thủ công upload 100+ ảnh, backup/restore, file sai và SafeStore.

## 3. Giao diện chuẩn đích

- [~] 3.1 Header: logo, nhạc/SFX riêng, cài đặt và Giảm hiệu ứng; hướng dẫn/toàn màn hình còn thiếu.
- [x] 3.2 Panel chọn lớp và phi hành đoàn.
- [x] 3.3 Dark mode navy/cyan/lime có hierarchy, focus state và không dùng khối hình thô.
- [x] 3.4 Sân khấu với HUD trạng thái và ba góc camera.
- [x] 3.5 Điều khiển số bạn, không gọi trùng, thời gian và bắt đầu lượt.
- [~] 3.6 Quản lý lớp và nội dung đã có; nhật ký chuyến bay/Chế độ giáo viên còn thiếu.
- [x] 3.7 Responsive laptop/màn hình hẹp, bàn phím và Giảm hiệu ứng.

## 4. Cảnh 3D và âm thanh

- [x] 4.1 Dựng UFO, khu phố, cây, bụi, nước, vật cản và nhân vật tự tạo.
- [x] 4.2 Ba góc camera: toàn cảnh, theo dấu UFO, góc phố.
- [x] 4.3 Quét: nhạc tăng nhịp, UFO blink, tia sáng quét và mục tiêu bí mật.
- [x] 4.4 Hành động né tránh: lộn nhào, đào đất, nhảy nước, leo cây, chui bụi, nhảy hàng rào.
- [x] 4.5 Giới hạn hành động đồng thời/cooldown và giảm hiệu ứng để giữ hiệu năng.
- [~] 4.6 Chuỗi quét → hút → bài học → thả xuống/thử lại; nhật ký còn thiếu.
- [x] 4.7 Âm thanh Web Audio bật/tắt ngay được.

## 5. Kiểm thử và phát hành

- [x] 5.1 Chạy 40 test, type-check và build production.
- [~] 5.2 Đã kiểm tra settings, kho ảnh trống/ngân hàng bài, lượt quét và quiz end-to-end trên Pages; còn test flashcard, điền từ/anagram/unjumble với dữ liệu thật và ảnh lỗi.
- [~] 5.3 Đã kiểm tra reload, không trùng cơ bản và Giảm hiệu ứng; còn test lớp/học sinh, âm thanh và reset đầy đủ trên máy có WebGL.
- [x] 5.4 Cập nhật README và GitHub Pages.
- [x] 5.5 Xác nhận link phát hành.
