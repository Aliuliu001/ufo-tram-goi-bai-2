# Kế hoạch tái tạo — UFO | TRẠM GỌI BÀI 3D

## Mục tiêu đã xác nhận

Tái tạo website tham chiếu: `ufo. | TRẠM GỌI BÀI 3D – Cuộc Rượt Đuổi Ngoài Hành Tinh`.

Bản hiện tại trong repo là một ứng dụng khác về bố cục và luồng chơi (chọn từ/quiz). Nó không phải bản đích. Toàn bộ hướng triển khai dưới đây lấy website tham chiếu làm chuẩn về giao diện và trải nghiệm; không sao chép mã nguồn hay tài sản riêng của website gốc.

## Những gì đã khảo sát từ website gốc

- Giao diện desktop nền navy/indigo, viền neon xanh chanh, bố cục ba vùng rõ ràng.
- Thanh đầu trang: logo UFO, nhãn **TRẠM GỌI BÀI**, nhạc kịch tính, hiệu ứng, hướng dẫn và toàn màn hình.
- Cột trái: chọn lớp, danh sách phi hành đoàn theo lớp, bật/tắt từng học sinh và **Bật tất cả**.
- Khu vực chính: bảng cảnh 3D với ba góc nhìn **Toàn cảnh / Theo dấu UFO / Góc phố**.
- Điều khiển lượt: số bạn lên tàu, không gọi trùng, thời gian dò 6/8/10 giây, nút bắt đầu và phím Space.
- Nhật ký chuyến bay: lưu người đã được gọi, có nút bắt đầu vòng mới.
- Quản lý lớp/học sinh và lịch sử gọi được lưu trên thiết bị giáo viên.

## Phạm vi bản tái tạo

1. Tạo giao diện mới, bám sát bố cục, chức năng và nhịp tương tác của website tham chiếu.
2. Cung cấp dữ liệu lớp mẫu, không đưa tên học sinh thật vào mã nguồn.
3. Lưu lớp, học sinh, thiết lập và lịch sử gọi bằng `localStorage` trên thiết bị giáo viên.
4. Cung cấp thêm/sửa/xóa lớp và học sinh.
5. Hỗ trợ chọn ngẫu nhiên: không trùng, cho phép trùng, 1 hoặc nhiều học sinh/lượt, các mốc 6/8/10 giây.
6. Tạo cảnh 3D UFO tự dựng bằng Three.js: quét, đổi góc camera, bay đến và tia hút.
7. Cung cấp âm thanh Web Audio tự tạo, không sao chép audio hay hình ảnh của website gốc.
8. Thiết kế responsive cho laptop lớp học và màn hình hẹp.

## Lộ trình triển khai

### Giai đoạn 1 — Nền dữ liệu và luồng gọi bài

- Chuẩn hóa mô hình `Classroom`, `Student`, `FlightLog`, `Settings`.
- Tạo kho localStorage có migration, dữ liệu mẫu và thao tác quản lý lớp/học sinh.
- Viết logic chọn ngẫu nhiên có/không chống trùng, chọn nhiều bạn và reset vòng.
- Viết test cho các luật chọn.

**Hoàn thành khi:** đổi lớp, sửa danh sách, tải lại trang và gọi ngẫu nhiên đều giữ đúng dữ liệu.

### Giai đoạn 2 — Giao diện bám chuẩn website gốc

- Thay toàn bộ layout hiện có bằng header + cột điều khiển + sân khấu + nhật ký.
- Dùng visual language mới: navy glass, cyan, lime, typography rõ ràng; không dùng asset sao chép.
- Thêm modal Quản lý lớp học, Hướng dẫn, trạng thái hệ thống và điều khiển âm thanh/toàn màn hình.

**Hoàn thành khi:** bố cục và thứ tự thao tác khớp website tham chiếu ở kích thước laptop.

### Giai đoạn 3 — Cảnh 3D và hiệu ứng lượt gọi

- Cảnh khu phố 3D tự dựng với học sinh dạng nhân vật đơn giản và UFO neon.
- Ba góc camera: toàn cảnh, bám UFO, góc phố.
- Chuỗi lượt: đếm ngược → quét bí mật → khóa mục tiêu → tia hút → công bố → ghi nhật ký.
- Thêm hiệu ứng âm thanh tự tạo, tuân theo nút bật/tắt.

**Hoàn thành khi:** mục tiêu chỉ được lộ sau khi đếm ngược kết thúc và hoạt ảnh không phá thao tác quản lý.

### Giai đoạn 4 — Kiểm thử và phát hành

- Kiểm tra unit test, build production, và giao diện trên desktop.
- Kiểm tra thủ công: quản lý lớp, đổi lớp, tắt/bật học sinh, không trùng, nhiều bạn/lượt, reset, reload.
- Cập nhật README, push commit và kiểm tra GitHub Pages.

## Tiêu chí nghiệm thu

- Có thể quản lý lớp và học sinh bằng giao diện tiếng Việt.
- Dữ liệu chỉ lưu cục bộ trên máy giáo viên.
- Chế độ không gọi trùng hoạt động xuyên suốt một vòng.
- Lượt gọi có đếm ngược và công bố sau hiệu ứng UFO.
- UI dùng được trên laptop 1366×768 và không che nút điều khiển quan trọng.
- Không có tên học sinh thật hoặc tài sản sao chép từ website gốc trong repository.
