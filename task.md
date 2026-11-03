# Danh sách công việc — tái tạo UFO Trạm Gọi Bài 3D

> Chỉ đánh dấu hoàn tất khi đã kiểm tra. `[~]` là đã có bản chạy nhưng còn cần kiểm thử thực tế.

## 0. Khảo sát và định hướng

- [x] Khảo sát website gốc, xác định layout và luồng chơi đích.
- [x] Chốt cảnh quét hài hước, ngân hàng ảnh/text và ba dạng bài.
- [x] Viết plan kỹ thuật, kiến trúc SafeStore/ImageDB và tiêu chí nghiệm thu.

## 1. Nền game và dữ liệu lớp

- [x] Model lớp, học sinh, lịch sử chuyến bay và thiết lập.
- [x] LocalStorage an toàn, chọn ngẫu nhiên, chống trùng, chọn nhiều bạn và reset vòng.
- [x] Unit test cho luật gọi bài.
- [~] Quản lý thêm/sửa/xóa lớp và danh sách học sinh qua modal.
- [ ] Bật/tắt từng học sinh và Bật tất cả trong UI đích.

## 2. Kho ảnh, backup và nội dung học tập

- [x] ImageDB/IndexedDB, nén WebP, giữ alpha, chuẩn hóa ID và báo file không hợp lệ.
- [x] Kho ảnh kéo-thả, thumbnail, dung lượng, xóa có xác nhận.
- [~] SafeStore fallback và kiểm tra quota; cần kiểm tra trên trình duyệt hạn chế storage.
- [~] Backup/restore JSON cho lớp và ảnh; cần kiểm thử vòng backup → xóa → restore.
- [x] Model câu hỏi và kiểm tra Quiz bốn đáp án.
- [x] UI tạo/xóa/bật-tắt nội dung học tập.
- [~] Flashcards 1–7, Quiz, Điền khuyết, Anagram, Unjumble và luồng đúng/thử lại.
- [ ] Chọn ảnh đã upload trực tiếp trong form câu hỏi và xem trước ảnh.

## 3. Giao diện

- [x] Khôi phục dark mode navy/cyan/lime, sân khấu Three.js, skin và camera.
- [~] Header, lớp, điều khiển lượt, camera, nhật ký và Settings modal.
- [ ] Bố cục ba vùng giống bản tham chiếu và panel Phi hành đoàn tắt/bật từng bạn.
- [ ] Responsive laptop/màn hẹp, toàn màn hình, hướng dẫn và Giảm hiệu ứng.

## 4. Cảnh 3D và âm thanh

- [x] Khu phố, UFO, nhân vật và ba góc camera.
- [~] Quét bí mật, đếm ngược, chọn mục tiêu và tia hút.
- [ ] UFO blink/tia quét rõ hơn, nhạc tăng nhịp theo thời gian dò.
- [ ] Hành động né vui: lộn nhào, đào đất, nhảy nước, leo cây, chui bụi, nhảy hàng rào.
- [ ] Cooldown, giới hạn hành động đồng thời và hiệu năng yếu.
- [~] Chuỗi bắt → bài học → thả xuống/thử lại → nhật ký.

## 5. Kiểm thử và phát hành

- [x] Type-check, production build và 40 test tự động.
- [ ] Kiểm thử trình duyệt: kho ảnh, backup/restore, ba dạng bài, lớp, âm thanh và giảm hiệu ứng.
- [ ] Cập nhật README và cấu hình GitHub Pages.
- [ ] Xác nhận link phát hành.
