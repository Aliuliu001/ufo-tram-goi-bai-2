# UFO Trạm Gọi Bài — Context dự án

## Trạng thái hiện tại
- Repo công khai: `https://github.com/Aliuliu001/ufo-tram-goi-bai`; game: `https://aliuliu001.github.io/ufo-tram-goi-bai/?v=2`.
- Đã có sân khấu Three.js 3D thật: khu phố, đường, nhà/cây, sao/hành tinh, UFO, 5 phi hành gia chạy và nhãn tên nổi.
- Đã có kéo-xoay/zoom tự do, skin đổi màu UFO/tia hút, gọi ngẫu nhiên không trùng ở bản nền.
- Đã kiểm tra Pages ở 1280×633: canvas 3D, nhãn 5 học sinh, UFO tuần tra và cảnh hút sau khi gọi hoạt động.
- Bản tham khảo: `https://sites.google.com/view/ufotrmgibi3d-cucrtuingoihnhtin/full-page-embed?authuser=1&pli=1`; source repo gốc đã bị tác giả xóa.

## Quyền sử dụng
- Anh Ngọc Trương đã xin và được tác giả/đồng nghiệp cấp phép dùng, chỉnh sửa và tùy biến thoải mái.
- Dự án mới vẫn ưu tiên giao diện, ảnh, âm thanh và nhận diện tự tạo để có sản phẩm riêng, dễ tiếp tục phát triển.

## Quyết định đã chốt
- Tạo game thành dự án độc lập dưới GitHub của `Aliuliu001`, có GitHub Pages để mở link và chơi.
- Tên tạm: **UFO Trạm Gọi Bài**.
- Repo đã chốt: `Aliuliu001/ufo-tram-goi-bai`.
- Game phải có skin/trang phục tùy chọn và hỗ trợ ảnh skin cá nhân ở giai đoạn sau.
- Mã nguồn dễ chỉnh: HTML/CSS/JavaScript thuần; Three.js chỉ cho hiệu ứng 3D nhẹ.
- Giao diện tiếng Việt, nút ghi rõ hành động; ưu tiên dùng tốt cho giáo viên trên laptop.
- Dữ liệu học sinh không commit vào GitHub công khai.

## Nguồn tham khảo kỹ thuật
- Mã HTML của trang tham khảo đang được nhúng trực tiếp qua Google Sites.
- Đã rà lại phần 3D gốc: Three.js tạo WebGL canvas, thị trấn (đường, nhà, cây, đèn), sao/hành tinh, UFO 3D, cone tia hút, vòng năng lượng và các nhân vật phi hành gia 3D chạy quanh.
- Cơ chế gốc: camera orbit kéo-thả/zoom; UFO tuần tra khi chờ; lúc gọi thì quét, bay theo mục tiêu và hút nhân vật lên.
- Vì đã có quyền của tác giả, dự án mới có thể tái tạo lại cơ chế/mô hình đó và phát triển skin riêng. Không cần sử dụng asset cũ.
- Khi đến phần nhiều ảnh skin: dùng IndexedDB + sao lưu JSON, không lưu ảnh lớn trong localStorage.

## Quy tắc vòng dò tìm đã chốt
- Có ba camera: **Toàn cảnh** (góc hiện tại), **Theo dấu UFO** (bám bay mềm theo UFO), **Góc phố** (thấp/cận nhân vật).
- Giáo viên chọn được số bạn lên tàu bằng `− / +`, tối thiểu 1 và không vượt số bạn sẵn sàng.
- Mặc định không gọi trùng: gọi hết danh sách rồi mới làm vòng mới. Có công tắc để cho phép gọi trùng khi cần.
- Thời gian dò là lúc UFO đổi nhiều mục tiêu, rọi sáng tên từng bạn để tạo kịch tính. Kết quả ngẫu nhiên phải giữ kín cho đến hết đếm ngược.
- Hết giờ mới khóa mục tiêu, hút lần lượt đúng số bạn đã chọn; sau đó mới hiện tên và ảnh/biểu tượng của các bạn được chọn.

## Phân bố giao diện đã chốt
- **Ngoài màn chơi:** Danh sách lớp, Danh sách phi hành đoàn + ảnh nhỏ và bật/tắt tham gia, số bạn lên tàu, chống trùng, thời gian dò, bắt đầu dò, camera, HUD/nhật ký ngắn, nhạc/SFX/hướng dẫn/toàn màn hình.
- **Trong `⚙️ Quản lý`:** thêm/sửa/xóa lớp, bảng học sinh một dòng/một bạn, kho ảnh & gán ảnh, skin có sẵn/Skin của tôi, sao lưu/khôi phục/làm sạch.
- Ảnh học sinh là tùy chọn. Không có ảnh thì dùng avatar tương ứng skin.
- Skin UFO và nhân vật là hai lựa chọn tách biệt để ghép tự do.
- Có skin Pokémon qua ảnh artwork/sprite được tải trực tiếp từ PokeAPI (không sao chép ảnh vào repo); khi không có mạng/lỗi tải ảnh, game tự dùng avatar phi hành gia. `Skin của tôi` vẫn dành cho asset được phép dùng.

## Rà lại game tham khảo
- Đã ghi nhận đầy đủ: danh sách lớp, quản lý lớp, phi hành đoàn bật/tắt nhanh, bộ đếm số chọn, không trùng, thời gian dò, camera, nhật ký chuyến bay, popup người thắng, BGM/SFX riêng, hướng dẫn và toàn màn hình.
- Cần tối ưu thêm cho bản của anh: ảnh học sinh, skin tách UFO/nhân vật, IndexedDB và backup/restore — những phần bản tham khảo chưa có đầy đủ.

## Phase B đã hoàn thành
- Có 3 camera: Toàn cảnh kéo-xoay/zoom, Theo dấu UFO và Góc phố.
- Có `− / +` chọn số bạn lên tàu; mặc định không gọi trùng, có công tắc tắt khi cần.
- Có thời gian dò nhanh 6/8/10 giây và phím Space để bắt đầu.
- Trong lúc dò, UFO đổi mục tiêu/rọi nhãn tên nhưng không công bố kết quả.
- Hết thời gian, UFO hút lần lượt; chỉ sau khi hút xong mới công bố tên kết quả.
- Đã kiểm tra cục bộ và Pages; 8 kiểm tra tự động đều đạt.

## Bước tiếp theo
1. Anh kiểm tra và duyệt Phase B trên link Pages.
2. Sau khi anh duyệt, bắt đầu Phase C1–C11: lớp, học sinh, ảnh đại diện, skin và backup/restore.

## Lưu ý vận hành
- Mỗi lần GitHub Pages cập nhật, anh mở link rồi bấm `Ctrl + Shift + R` để tải bản mới.
- Sau khi có dữ liệu lớp thật, tải file Sao lưu JSON về máy/Drive sau mỗi buổi để không mất dữ liệu khi xóa trình duyệt hoặc đổi máy.
- Không ghi mật khẩu, token GitHub hay tên học sinh thật vào các file tài liệu/mã nguồn công khai.
