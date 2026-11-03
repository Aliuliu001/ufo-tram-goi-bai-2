# Danh sách công việc — tái tạo UFO Trạm Gọi Bài 3D

> Trạng thái chỉ được chuyển sang hoàn tất khi đã kiểm tra. Bản cũ trong repo là nền tham khảo kỹ thuật, không phải giao diện đích.

## 0. Khảo sát và định hướng

- [x] Xác nhận URL website gốc và khảo sát giao diện/luồng chơi.
- [x] Xác nhận repo hiện tại đang chứa project khác về UI và cơ chế quiz.
- [x] Viết lại kế hoạch triển khai theo website gốc.

## 1. Dữ liệu và luật gọi bài

- [ ] 1.1 Tạo model lớp, học sinh, lịch sử chuyến bay và thiết lập.
- [ ] 1.2 Lưu/đọc localStorage với dữ liệu lớp mẫu.
- [ ] 1.3 Thêm/sửa/xóa lớp và học sinh.
- [ ] 1.4 Bật/tắt từng học sinh và bật tất cả.
- [ ] 1.5 Chọn ngẫu nhiên 1/nhiều học sinh, có/không chống trùng.
- [ ] 1.6 Reset vòng và nhật ký chuyến bay.
- [ ] 1.7 Viết test cho các luật chọn ngẫu nhiên.

## 2. Giao diện chuẩn đích

- [ ] 2.1 Header: logo, âm thanh, hướng dẫn, toàn màn hình.
- [ ] 2.2 Panel chọn lớp và phi hành đoàn.
- [ ] 2.3 Sân khấu 3D với HUD trạng thái.
- [ ] 2.4 Điều khiển số bạn, không gọi trùng, thời gian và bắt đầu lượt.
- [ ] 2.5 Nhật ký chuyến bay và modal quản lý.
- [ ] 2.6 Responsive laptop/màn hình hẹp và khả năng dùng bàn phím.

## 3. Cảnh 3D và âm thanh

- [ ] 3.1 Dựng UFO, khu phố và nhân vật tự tạo.
- [ ] 3.2 Ba góc camera: toàn cảnh, theo dấu UFO, góc phố.
- [ ] 3.3 Chuỗi quét → đếm ngược → tia hút → công bố.
- [ ] 3.4 Âm thanh Web Audio bật/tắt được.

## 4. Kiểm thử và phát hành

- [ ] 4.1 Chạy test, type-check và build production.
- [ ] 4.2 Kiểm thử thủ công toàn bộ luồng gọi.
- [ ] 4.3 Cập nhật README và GitHub Pages.
- [ ] 4.4 Xác nhận link phát hành.
