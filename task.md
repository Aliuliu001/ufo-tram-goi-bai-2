# UFO Trạm Gọi Bài — Danh sách việc

> Chỉ đánh dấu xong sau khi đã kiểm tra thật trên GitHub Pages.

## Giai đoạn A — Nền dự án
- [x] A1. Tạo repo `Aliuliu001/ufo-tram-goi-bai` công khai.
- [x] A2. Tạo thư mục làm việc độc lập và các tài liệu dự án.
- [x] A3. Tạo trang GitHub Pages, kiểm tra đường link thật.
- [x] A4a. Dựng giao diện một màn hình và nền CSS thử nghiệm (không phải mô hình 3D, không được coi là hoàn tất yêu cầu 3D).
- [x] A4b. Thay sân khấu thử nghiệm bằng Three.js 3D thật: thị trấn, UFO, tia hút và nhân vật học sinh.
- [x] A4c. Làm camera kéo-xoay/zoom, hoạt ảnh chạy–quét–tia hút; skin đổi trên mô hình 3D.
- [x] A5. Kiểm tra 3D trực tiếp trên GitHub Pages ở 1280×633: canvas Three.js, 5 nhãn học sinh, tuần tra và cảnh tia hút sau khi gọi đều hoạt động. Bố cục đáp ứng đã có cho màn hình hẹp; sẽ rà tiếp 1366×768 ở đợt chỉnh giao diện.

## Giai đoạn B — Vòng dò tìm, góc nhìn và bắt lên tàu
- [x] B1. Thêm ba góc nhìn: Toàn cảnh, Theo dấu UFO, Góc phố.
- [x] B2. Làm chuyển camera mượt; Toàn cảnh còn kéo-xoay/zoom được.
- [x] B3. Thêm `− / +` chọn số bạn lên tàu, giới hạn theo số bạn còn sẵn sàng.
- [x] B4. Thêm công tắc Không gọi trùng và hành vi làm vòng mới khi đã gọi đủ.
- [x] B5. Thêm điều khiển Thời gian dò nhanh 6/8/10 giây và đồng hồ đếm ngược.
- [x] B6. Làm cảnh dò: UFO đổi nhiều mục tiêu, tên được rọi sáng nhưng chưa lộ kết quả.
- [x] B7. Khi về 0 giây, hút lần lượt đúng số bạn đã chọn rồi mới hiện tên/biểu tượng kết quả.
- [x] B8. Viết và chạy kiểm tra tự động: giới hạn số lượng, không trùng, mục tiêu đổi khi dò, kết quả chỉ lộ sau đếm ngược.
- [x] B9. Kiểm tra thật trên Pages: canvas 3D, 3 nút camera, 6/8/10 giây, bắt nhiều bạn cục bộ; trên Pages đã xác nhận Góc phố, dò 6 giây, giấu tên trong quá trình dò/hút rồi mới công bố và đánh dấu 1 bạn.

## Nền mới AI Studio — map UFO 3D
- [x] N1. Chép template AI Studio vào repo, giữ bản v10 cũ trong `legacy-v10/` để tham chiếu an toàn.
- [x] N2. Đổi cấu hình sang React + TypeScript + Vite và xuất bản build tĩnh cho GitHub Pages.
- [x] N3. Kiểm tra type-check, production build và 29 bài kiểm tra cũ đều đạt; kiểm tra trực quan đã thấy map 3D, UFO, trường, hang, hồ, hàng rào và nhân vật.
- [x] N4. Xóa âm “u u u” kéo dài khi UFO đã hút xong và đang chờ trả lời. Đã kiểm tra qua đủ vòng 3 giây → quiz trên Pages v12.
- [x] N5. Đặt Dark làm mặc định; chỉnh Light thành ban ngày dịu, thấy rõ UFO và nhân vật. Đã kiểm tra Dark mặc định và đổi theme cục bộ; bản Pages v12 đã phát hành.
- [ ] N6. Khôi phục bộ chọn quét `3 / 6 / 8 / 10 giây`, đồng hồ, nhạc kịch tính, UFO blink/tia quét và mục tiêu bí mật đến hết giờ. (Đã xong timer/đồng hồ/mục tiêu bí mật; còn nhạc kịch tính + nâng cấp blink/tia quét.)
- [ ] N7. Thêm các cảnh trốn hài hước: nhào lộn, đào đất, nhảy nước, leo cây, chui bụi, nhảy hàng rào và núp hang.
- [ ] N8. Nạp quản lý lớp/học sinh bền vững cho nền mới.
- [ ] N9. Nạp kho ảnh IndexedDB + sao lưu/khôi phục theo skill `game-image-upload`.
- [ ] N10. Nạp input bộ bài: điền từ thiếu, Flashcard và Quiz A/B/C/D.
- [ ] N11. Nạp hai mode bắt lần lượt và lịch sử kết quả.

## Giai đoạn C — Quản lý lớp, học sinh, ảnh và skin
- [ ] C1. Đặt Danh sách lớp + Phi hành đoàn ngoài màn chơi; bấm tên để tạm nghỉ/tham gia, có Bật tất cả.
- [ ] C2. Tạo `⚙️ Quản lý` gồm tab Lớp học / Học sinh / Ảnh học sinh / Skin / Dữ liệu.
- [ ] C3. Làm bảng một dòng/một học sinh: ảnh, tên, trạng thái; thêm/sửa/xóa nhiều bạn không dùng popup từng em.
- [ ] C4. Làm kho ảnh học sinh IndexedDB: upload nhiều/kéo-thả/gán ảnh/cảnh báo thiếu ảnh.
- [ ] C5. Hiện ảnh/biểu tượng học sinh ở danh sách, kết quả và thẻ chúc mừng; không ảnh thì dùng avatar skin mặc định.
- [ ] C6. Tách skin UFO với skin nhân vật; có 4 skin: Phi hành gia / Biệt đội động vật / Khu rừng tí hon / Pokémon qua PokeAPI.
- [ ] C7. Làm skin Pokémon: mỗi học sinh có sprite khác nhau từ PokeAPI, lỗi mạng thì về avatar phi hành gia.
- [ ] C8. Làm Skin của tôi: tải asset được phép dùng, chọn UFO/nhân vật/ảnh kết quả.
- [ ] C9. Thêm Nhật ký chuyến bay, Nhạc nền/SFX riêng, Hướng dẫn và Toàn màn hình theo bản tham khảo.
- [ ] C10. Làm sao lưu/khôi phục gồm lớp, học sinh, ảnh, skin, cài đặt và lịch sử.
- [ ] C11. Kiểm tra: 4 lớp × 20 học sinh; 20+ ảnh; backup → xóa → restore → tải lại.

## Giai đoạn D — Dữ liệu và trải nghiệm lớp học
- [ ] D1. Thêm công tắc âm thanh hiệu ứng và nhạc nền riêng.
- [ ] D2. Thêm sao lưu/khôi phục JSON đầy đủ.
- [ ] D3. Kiểm tra vòng sao lưu → xóa → khôi phục → tải lại.
- [ ] D4. Viết hướng dẫn sử dụng bình dân trong README.

## Giai đoạn E — Phát hành
- [ ] E1. Kiểm tra JavaScript và kiểm tra luật chơi.
- [ ] E2. Kiểm tra trực tiếp trên GitHub Pages sau khi trang cập nhật.
- [ ] E3. Rà soát ảnh/âm thanh và dữ liệu mẫu không chứa thông tin học sinh thật.
- [ ] E4. Gửi anh link chơi và nhắc `Ctrl + Shift + R`.
