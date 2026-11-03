# UFO Trạm Gọi Bài — Kế hoạch thực hiện

## 1. Mục tiêu
Tạo game web độc lập, mới hoàn toàn về giao diện và cách tổ chức mã nguồn, lấy cảm hứng từ cơ chế **Trạm Gọi Bài UFO** mà anh đã được tác giả cấp quyền dùng/chỉnh sửa. Game chạy bằng một đường link GitHub Pages của tài khoản `Aliuliu001`.

Tên dự án tạm dùng: **UFO Trạm Gọi Bài**. Repo dự kiến: `Aliuliu001/ufo-tram-goi-bai`.

## 2. Phạm vi bản đầu tiên

### Giữ lại tinh thần game gốc
- Không gian ngoài hành tinh/UFO, có yếu tố gọi ngẫu nhiên để tạo hồi hộp.
- Giáo viên nhập danh sách học sinh và câu hỏi để chơi tại lớp.
- Chọn/ngẫu nhiên một học sinh, hiển thị câu hỏi, trả lời đúng/sai và tổng kết lượt.
- Hiệu ứng chuyển động 3D nhẹ, chạy được trên laptop lớp học.

### Làm mới toàn bộ phần nhìn
- Giao diện riêng, không bê nguyên nhận diện hay hình ảnh cũ.
- Chủ đề mặc định: **UFO neon trong không gian**, chữ dễ nhìn, nút rõ thao tác.
- Tạo hệ thống **skin/trang phục** cho phi hành đoàn hoặc nhân vật được gọi:
  - Skin có sẵn ngay trong game.
  - Giáo viên được chọn skin trước khi chơi.
  - Thiết kế dữ liệu để sau này thêm ảnh/trang phục do anh tự tải lên.
- Tối ưu một màn hình laptop 1366×768; không có nút bé hoặc chữ chen chúc.

### Không làm ở bản đầu
- Đăng nhập/tài khoản học sinh.
- Bảng xếp hạng trực tuyến.
- Lưu dữ liệu lên máy chủ.
- Sao chép hình/âm thanh/nhận diện của bản đồng nghiệp nếu chưa có tệp gốc rõ ràng.

## 3. Hướng kỹ thuật
- **HTML, CSS, JavaScript thuần**: dễ bảo trì và đưa lên GitHub Pages.
- **Three.js**: chỉ dùng cho nền/hiệu ứng UFO 3D nhẹ; phần dữ liệu và bảng điều khiển không phụ thuộc 3D để game không bị lỗi khi máy yếu.
- `localStorage` an toàn cho danh sách lớp, câu hỏi và cài đặt; có nút sao lưu/khôi phục JSON ở giai đoạn dữ liệu.
- Kho ảnh skin về sau dùng IndexedDB để không giới hạn bởi bộ nhớ nhỏ của trình duyệt.
- Dữ liệu mẫu không có thông tin học sinh thật.

## 4. Cấu trúc dự kiến

```text
ufo-tram-goi-bai/
├── index.html                 # Màn hình chính
├── README.md                  # Cách mở/chơi/quản lý dữ liệu
├── plan.md                    # Kế hoạch này
├── task.md                    # Danh sách việc và tình trạng
├── context.md                 # Quyết định đã chốt + bước tiếp theo
├── assets/
│   ├── icons/
│   ├── skins/                 # Skin có sẵn, giấy phép rõ ràng
│   └── sounds/                # Âm thanh tự tạo/được cấp quyền
├── css/
│   ├── tokens.css             # Màu, chữ, khoảng cách dùng chung
│   └── app.css                # Bố cục và hiệu ứng
├── js/
│   ├── data-model.js          # Cấu trúc lớp, học sinh, câu hỏi, skin
│   ├── storage.js             # Lưu/đọc + sao lưu/khôi phục
│   ├── game-engine.js         # Vòng chơi, ngẫu nhiên, đúng/sai
│   ├── renderer.js            # Vẽ giao diện 2D
│   ├── scene3d.js             # Nền Three.js tách biệt
│   ├── settings.js            # Bảng nhập dữ liệu giáo viên
│   └── app.js                 # Nối các phần và khởi động game
└── tests/
    └── game-engine.test.js    # Kiểm thử luật chơi bằng Node
```

## 5. Tiến độ nền AI Studio và Phase ưu tiên hiện tại

> Tài liệu thiết kế chi tiết: `.hermes/plans/2026-11-02_103000-ufo-classroom-quiz-image-system.md`. `task.md` chỉ đánh dấu xong khi Pages thật đã kiểm tra.

### Đã có sau khi thay nền AI Studio
- Map Three.js: UFO Boss, trường, hang, hồ/cầu, hàng rào, vườn và nhân vật mẫu.
- Camera khu vực, chase camera và modal điền chữ mẫu.
- Bản nền cũ giữ tại `legacy-v10/` để lấy lại các luật/hệ thống đã có mà template mới chưa mang sang.

### Phase N — Sửa trải nghiệm trước khi nạp lớp và bài học

**N1. Âm thanh:** Bỏ hoàn toàn tiếng “u u u” kéo dài lúc UFO đã hút xong/chờ câu trả lời. Chỉ giữ SFX ngắn và tiếng đúng/sai; tắt SFX phải dừng ngay.

**N2. Theme:** Dark là mặc định và được lưu lại. Light chuyển thành ban ngày dịu, giảm độ chói của trời/cỏ, tăng tương phản để nhìn rõ nhân vật, UFO và tia quét.

**N3. Cảnh quét:** Giáo viên chọn `3 / 6 / 8 / 10 giây`; đồng hồ đếm ngược rõ ràng. Mục tiêu được chọn bí mật, UFO blink và quét nhiều nơi; chỉ sau hết giờ mới đuổi/hút đúng mục tiêu.

**N4. Cảnh trốn hài:** Sau N3, bổ sung theo từng điểm map có thật: nhào lộn, đào đất, chui bụi, leo cây, nhảy nước, nhảy hàng rào và núp hang. Không cho tất cả em làm cùng một động tác hoặc chạy quá nhanh thành vệt.

**N5. Dữ liệu giáo viên:** Chỉ sau khi N1–N4 ổn định: quản lý lớp/học sinh → kho ảnh IndexedDB theo skill `game-image-upload` → input bài Điền từ thiếu/Flashcard/Quiz A-B-C-D → hai mode bắt lần lượt → backup/khôi phục.

## 6. Các giai đoạn cũ và lịch sử thiết kế

> Các mục bên dưới là kế hoạch ban đầu trước khi AI Studio template được nạp. Quyết định mới ở Phase N phía trên được ưu tiên khi có khác nhau.

## 5. Các giai đoạn

### Giai đoạn A — Tạo nền dự án và bản chạy đầu
1. Tạo repo công khai, thư mục làm việc riêng, tài liệu `README.md`, `plan.md`, `task.md`, `context.md`.
2. Tạo GitHub Pages và kiểm tra có link chơi được.
3. Dựng khung một màn hình: tiêu đề, khu vực sân khấu UFO, bảng lớp, điều khiển.
4. **Làm sân khấu Three.js 3D thật**, lấy cảm hứng từ game được cấp phép: thị trấn/đường phố, nhà/cây/đèn, bầu trời sao và hành tinh; không dùng nền CSS để giả 3D.
5. Dựng UFO từ các khối 3D (thân đĩa, mái kính, phi công ngoài hành tinh, đèn viền, tia hút) và cho UFO bay tuần tra.
6. Dựng từng học sinh thành nhân vật phi hành gia 3D nhỏ, có nhãn tên nổi và hoạt ảnh chạy quanh khu phố.
7. Thêm camera góc nhìn nghiêng: tự quay chậm khi chờ, có thể kéo để xoay và lăn chuột để phóng to/thu nhỏ.
8. Khi gọi: chuyển sang quét 5–6 giây, UFO bay theo mục tiêu rồi tia hút kéo nhân vật được gọi lên tàu. Skin phải đổi thật màu tàu/đèn/beam trong mô hình 3D.

**Xong khi:** mở link Pages thấy mô hình 3D thật trên canvas, kéo camera được; học sinh chạy, UFO bay, và gọi một em kích hoạt đầy đủ cảnh quét–bay tới–tia hút. Không có lỗi JavaScript, dùng được trên kích thước 1280×633 và 1366×768.

### Giai đoạn B — Vòng dò tìm, góc nhìn và bắt lên tàu

#### B1. Ba góc nhìn 3D
1. Thêm cụm nút góc nhìn bên dưới sân khấu; nút đang dùng có trạng thái nổi bật rõ ràng.
2. **Toàn cảnh:** giữ đúng góc nhìn hiện có — quan sát toàn bộ khu phố, UFO và tất cả học sinh.
3. **Theo dấu UFO:** camera bám mềm phía sau/chếch trên UFO; khi UFO bay đổi mục tiêu, camera di chuyển theo nhưng không rung giật.
4. **Góc phố:** camera hạ xuống gần mặt đường, nhìn cận cảnh các nhân vật đang chạy và UFO ở phía trên; không để camera xuyên qua nhà/cây.
5. Chuyển góc nhìn bằng nội suy mượt, không cắt cảnh đột ngột; khi không dò tìm, người chơi vẫn có thể kéo/xoay và zoom ở chế độ Toàn cảnh.

#### B2. Điều khiển số lượng và luật chọn học sinh
1. Thêm ô số **Số bạn lên tàu** với nút `−` và `+`; tối thiểu 1, tối đa bằng số bạn còn sẵn sàng.
2. Hiển thị rõ dạng `ĐÃ LÊN TÀU 0 / N` để giáo viên biết đang bắt bao nhiêu bạn trong lượt.
3. Thêm công tắc **Không gọi trùng**:
   - Bật (mặc định): học sinh đã lên tàu sẽ không được chọn lại; khi tất cả đã được chọn, hiện nút làm vòng mới.
   - Tắt: vẫn cho phép chọn lại tên ở các lượt sau.
4. Khi giáo viên đổi số lượng hoặc bật/tắt không trùng, không làm mất kết quả đã có của lượt hiện tại.

#### B3. Thời gian dò và kịch tính trước khi bắt
1. Thêm điều khiển **Thời gian dò** theo giây (mặc định 6 giây; giới hạn hợp lý 3–20 giây) cùng đồng hồ đếm ngược lớn.
2. Khi bấm `🚀 Bắt đầu dò tìm`, hệ thống chọn sẵn kết quả ngẫu nhiên trong bộ nhớ nhưng **không hé lộ tên** cho đến giây cuối.
3. Trong toàn bộ thời gian dò:
   - UFO tăng tốc bay qua nhiều học sinh còn hợp lệ.
   - Tên mỗi bạn được UFO chiếu qua sẽ phát sáng/đánh dấu ngắn rồi tắt.
   - Mục tiêu thay đổi liên tục; camera Theo dấu UFO phản ánh đường bay đó.
   - Âm thanh/đèn/tia quét tăng nhịp dần theo thời gian còn lại.
4. Chỉ khi đồng hồ về 0: khóa mục tiêu cuối, UFO bay đến vị trí đó, bật tia hút, kéo đúng N nhân vật lên tàu; sau đó mới hiện tên và ảnh/biểu tượng của từng bạn được chọn.
5. Với N > 1, hút lần lượt từng bạn theo cùng một cảnh thay vì làm biến mất đồng thời.

#### B4. Kết quả và kiểm tra
1. Khu vực kết quả hiện ảnh/biểu tượng phi hành gia, tên, số thứ tự lên tàu và thời điểm của từng bạn.
2. Viết kiểm tra tự động cho: giới hạn `−/+`, chống gọi trùng, chọn đủ N người, chỉ công bố kết quả sau hết giờ, và làm vòng mới.
3. Kiểm tra thật trên Pages ở ba góc nhìn, với thời gian dò 3/6/20 giây và số bắt 1/nhiều bạn.

**Xong khi:** giáo viên chọn được góc nhìn, thời gian dò và số bạn lên tàu; UFO đổi mục tiêu trong lúc dò; tên chỉ lộ khi hết giờ; không gọi trùng theo chế độ đã chọn; cảnh hút và kết quả đúng với số lượng yêu cầu.

### Giai đoạn C — Quản lý lớp, học sinh, ảnh và skin

#### C1. Chia phần thao tác nhanh và phần Quản lý

**Đặt ngoài màn chơi** — vì giáo viên cần thao tác liên tục trong một tiết:
1. **Danh sách lớp**: cột/thanh gọn, bấm một lần để đổi lớp đang chơi.
2. **Danh sách phi hành đoàn của lớp đang chọn**: hiện tên + ảnh nhỏ; bấm tên để tạm cho bạn đó nghỉ/tham gia lại; có nút `✓ Bật tất cả`.
3. Điều khiển vòng dò: số bạn lên tàu, chống gọi trùng, thời gian dò, nút bắt đầu, ba góc camera.
4. HUD: số đã lên tàu, đồng hồ, nhật ký kết quả mới nhất và nút `↻ Bắt đầu vòng mới`.
5. Nút nhanh trên đầu: bật/tắt **Nhạc nền**, bật/tắt **Hiệu ứng**, **Hướng dẫn**, **Toàn màn hình**, và `⚙️ Quản lý`.

**Đặt trong `⚙️ Quản lý`** — vì chỉ dùng khi chuẩn bị/đổi dữ liệu, không nên làm rối lúc chơi:
1. Tab `📚 Lớp học`: thêm, đổi tên, sắp xếp, xóa lớp (xóa phải hỏi lại).
2. Tab `🧑‍🚀 Học sinh`: bảng một dòng/một học sinh gồm ảnh, tên, trạng thái; thêm/sửa/xóa nhiều bạn ngay trong bảng, không dùng popup từng em.
3. Tab `🖼️ Ảnh học sinh`: tải nhiều ảnh, kéo-thả, xem thumbnail, gán ảnh vào từng học sinh; tên/ảnh chưa gán có cảnh báo rõ.
4. Tab `🎨 Skin`: chọn skin đang dùng, xem trước UFO + nhân vật + tia hút, quản lý skin do anh tải lên.
5. Tab `💾 Dữ liệu`: sao lưu/khôi phục JSON, làm sạch dữ liệu có xác nhận.

#### C2. Mô hình ảnh học sinh
1. Mỗi học sinh có cấu trúc `id`, `tên`, `ảnh đại diện tùy chọn`, `trạng thái tham gia`; tên là dữ liệu bắt buộc, ảnh là tùy chọn.
2. Nếu chưa có ảnh: hiện avatar phi hành gia mặc định theo skin, không hiện ô lỗi/mất mặt.
3. Ảnh đại diện dùng ở ba nơi: danh sách phi hành đoàn, nhãn/kết quả bắt lên tàu, và thẻ chúc mừng cuối cảnh hút.
4. Ảnh được nén khi tải lên, lưu trong IndexedDB; bảng lớp chỉ lưu mã tham chiếu ảnh để không chậm/đầy bộ nhớ.
5. Sao lưu JSON phải gói cả lớp, học sinh, trạng thái, cài đặt, skin và ảnh; khôi phục kiểm tra đúng file trước khi thay dữ liệu hiện có.

#### C3. Hệ skin có thể mở rộng
1. Tách **skin UFO** và **skin nhân vật dưới phố** để giáo viên có thể ghép tự do, ví dụ UFO mặc định + Pokémon/động vật.
2. Mỗi skin gồm: tên, ảnh xem trước, màu đèn, màu tia hút, mô hình UFO/nhân vật hoặc tập ảnh sprite/ảnh cắt nền.
3. Bản có sẵn dùng hình/mô hình tự dựng hoặc có giấy phép rõ ràng:
   - `🛸 Phi hành gia` — UFO và người phi hành gia mặc định.
   - `🐾 Biệt đội động vật` — thú dễ thương/hoạt hình.
   - `🌿 Khu rừng tí hon` — sinh vật rừng dễ thương.
   - `⚡ Pokémon` — dùng artwork/sprite từ PokeAPI qua đường link ngoài, không chép hay lưu ảnh thương hiệu vào repo.
4. **Skin Pokémon:** game UFO gốc không có skin này; repo `pokemon-card-clash` của anh đang dùng PokeAPI official artwork (Pikachu/Charizard) qua URL. Bản UFO sẽ dùng cùng cơ chế: mỗi học sinh hiển thị một Pokémon khác nhau dạng sprite 3D/billboard có hoạt ảnh chạy; UFO đổi bảng màu đèn/tia hút. Cần mạng để tải artwork; nếu tải lỗi, tự trở về avatar phi hành gia mặc định.
5. `Skin của tôi` cho phép anh tự tải asset đã được phép dùng vào nội bộ. Game cũng sẽ hỗ trợ các skin “quái thú/linh thú” tự thiết kế, không sao chép thương hiệu.
6. Skin tùy chỉnh phải có màn chọn ảnh UFO, ảnh/mô hình nhân vật và ảnh kết quả; asset lớn lưu IndexedDB, không lưu base64 lớn trong localStorage.
7. Đổi skin không được làm mất lớp, danh sách học sinh, vòng đang chạy hoặc lịch sử kết quả.

#### C4. Rà lại game tham khảo và tối ưu bổ sung
Đã kiểm tra lại source công khai của game tham khảo. Các phần cần mang sang/hoàn thiện theo bản riêng:
1. Danh sách lớp bên ngoài + quản lý lớp trong popup.
2. Danh sách phi hành đoàn bấm để tạm nghỉ/tham gia lại, kèm `Bật tất cả`.
3. Nhật ký chuyến bay/kết quả theo thứ tự, nút dò lượt tiếp và bắt đầu vòng mới.
4. Bật/tắt nhạc nền và hiệu ứng riêng; nút hướng dẫn; toàn màn hình.
5. Thẻ công bố người được chọn sau khi hút — có ảnh đại diện, tên, thứ tự, nút đóng/dò lượt tiếp.
6. Tối ưu hiệu năng: giới hạn số ảnh/mô hình hiển thị cùng lúc, tắt bóng/hiệu ứng nặng khi máy yếu; không để skin tải lên làm chậm cảnh 3D.

#### C5. Kiểm tra
1. Thử 4 lớp × 20 học sinh, đổi lớp không mất dữ liệu và không lẫn kết quả giữa lớp.
2. Tải 20+ ảnh; tải lại trang vẫn đủ ảnh; ảnh PNG trong suốt không mất nền.
3. Sao lưu → xóa cả localStorage/IndexedDB → khôi phục → tải lại: lớp, ảnh, skin, cài đặt và lịch sử trở về đúng.
4. Đổi UFO/nhân vật trước và trong lúc chờ không phá camera, cảnh dò hay tia hút.

**Xong khi:** giáo viên thao tác nhanh được lớp và phi hành đoàn ngay ngoài màn chơi; quản trị/ảnh/skin nằm gọn trong một nơi; ảnh và skin không mất khi tải lại; có ít nhất 3 skin gốc hoạt động, và mọi dữ liệu được sao lưu/khôi phục đầy đủ.

### Giai đoạn D — Trải nghiệm lớp học và dữ liệu an toàn
1. Công tắc riêng cho âm thanh hiệu ứng và nhạc nền.
2. Nút hành động bằng tiếng Việt, tên bắt đầu bằng động từ: ví dụ `🚀 Bắt đầu gọi bài`, `🎲 Gọi học sinh`, `💾 Sao lưu dữ liệu`.
3. Thêm Sao lưu/Khôi phục toàn bộ lớp, câu hỏi, cài đặt và ảnh skin bằng một file JSON.
4. Cảnh báo trước thao tác xóa dữ liệu; không có xóa hàng loạt tự động.
5. Viết hướng dẫn cho anh dùng bằng lời bình dân và ảnh/chỉ dẫn ngắn.

**Xong khi:** sao lưu → xóa dữ liệu trình duyệt → khôi phục → tải lại vẫn trở về đúng dữ liệu trước đó.

### Giai đoạn E — Kiểm tra và phát hành
1. Kiểm tra trên màn hình laptop, điện thoại ngang và máy cấu hình yếu.
2. Rà soát bản quyền: chỉ để lại ảnh, âm thanh do anh cung cấp/tự tạo/được phép hoặc có giấy phép sử dụng rõ ràng.
3. Kiểm tra mã JavaScript, kiểm thử luật chơi và kiểm tra trực tiếp trên Pages.
4. Cập nhật cache-buster, đẩy GitHub, đợi Pages triển khai xong rồi kiểm tra link thật.

## 6. Tiêu chí nghiệm thu
- Link `https://aliuliu001.github.io/ufo-tram-goi-bai/` mở được (tên link có thể đổi nếu anh đổi tên repo).
- Không có lỗi JavaScript khi mở hoặc thực hiện một vòng chơi.
- Thao tác gọi ngẫu nhiên không gọi trùng trước khi danh sách hết.
- Skin thay đổi được về hình/màu/hiệu ứng, luật chơi giữ nguyên.
- Dữ liệu lớp và câu hỏi không mất sau khi tải lại trang.
- Sao lưu/khôi phục trả lại đầy đủ dữ liệu và ảnh skin.
- Giao diện mới, không dùng hình/nhận diện gốc của bản cũ ngoài những nội dung anh được cấp quyền và chủ động cung cấp.

## 7. Rủi ro và cách xử lý
- **Không có source gốc:** không phụ thuộc vào mã cũ; xây mới theo cơ chế đã quan sát và quyền tác giả đã cấp.
- **3D làm máy yếu chậm:** Three.js chỉ là lớp trang trí; có chế độ tắt hiệu ứng/chạy nền 2D dự phòng.
- **Ảnh skin nhiều làm mất dữ liệu:** dùng IndexedDB, không nhét ảnh lớn vào localStorage; có sao lưu JSON.
- **GitHub Pages lưu bản cũ trong trình duyệt:** tăng số phiên bản ở file tải; sau mỗi đợt em sẽ nhắc anh bấm `Ctrl + Shift + R`.
- **Dữ liệu học sinh:** không đưa tên/lớp thật vào repo công khai; chỉ tồn tại trong trình duyệt của máy anh hoặc file sao lưu anh giữ.

## 8. Những điểm cần anh duyệt trước khi xây
- Tên repo tạm: `ufo-tram-goi-bai`.
- Skin bản đầu: em đề xuất 3 skin mới hoàn toàn: **Thám hiểm Sao Mộc**, **Đội cứu hộ Ngân Hà**, **Thợ săn kho báu Vũ trụ**.
- Luật điểm bản đầu: cần anh chốt ở đầu Giai đoạn B, hoặc em sẽ dựng dạng đơn giản: Đúng +1, Sai 0, Bỏ qua 0.
- Loại câu hỏi đầu tiên: em đề xuất giáo viên nhập chữ/câu hỏi ngắn; ảnh và nghe âm thanh bổ sung sau khi bản chữ chạy ổn định.
