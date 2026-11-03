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

## Phạm vi đã mở rộng

1. Tạo giao diện mới, bám sát bố cục, chức năng và nhịp tương tác của website tham chiếu.
2. Cung cấp dữ liệu lớp mẫu, không đưa tên học sinh thật vào mã nguồn.
3. Lưu lớp, học sinh, thiết lập và lịch sử gọi bằng `localStorage` trên thiết bị giáo viên.
4. Cung cấp thêm/sửa/xóa lớp và học sinh.
5. Hỗ trợ chọn ngẫu nhiên: không trùng, cho phép trùng, 1 hoặc nhiều học sinh/lượt, các mốc 6/8/10 giây.
6. Tạo cảnh 3D UFO tự dựng bằng Three.js: quét, đổi góc camera, bay đến và tia hút.
7. Cung cấp âm thanh Web Audio tự tạo, không sao chép audio hay hình ảnh của website gốc.
8. Thiết kế responsive cho laptop lớp học và màn hình hẹp.
9. Tạo ngân hàng nội dung câu hỏi gồm ảnh PNG/JPEG/WebP và văn bản; giáo viên tự nạp, sửa, xóa và gán nội dung cho lớp.
10. Sau khi bị UFO bắt, học sinh thực hiện một trong ba dạng bài: chuỗi flashcard, quiz bốn lựa chọn, hoặc điền chữ/từ (anagram/unjumble).

## Quyết định trải nghiệm đã chốt

### Cảnh quét: kịch tính nhưng hài hước

Trong toàn bộ thời gian dò, UFO chớp đèn, thay hướng bay, chiếu tia sáng quét khắp khu phố và nhạc nền tăng nhịp. Mục tiêu thật vẫn bí mật đến cuối đồng hồ.

Nhân vật bị tia quét lướt qua nhưng **chưa** là mục tiêu cuối sẽ nhận một hành động né tránh ngẫu nhiên:

- lộn nhào hoặc nhào lộn;
- đào đất và núp xuống;
- nhảy xuống nước, bơi/trồi lên an toàn;
- leo lên cây;
- chui vào bụi;
- nhảy qua hàng rào hoặc núp sau vật thể.

Các hành động là hoạt ảnh vui nhộn, không mô tả gây hại. Khi bị bắt, học sinh được đưa lên UFO để làm bài; trả lời sai nghĩa là **ở lại UFO để thử lại**, không có nội dung đáng sợ.

Để không rối và không tụt khung hình, chỉ 2–3 nhân vật gần tia quét biểu diễn trong cùng một thời điểm; mỗi nhân vật có cooldown và không lặp hành động liên tiếp.

### Ngân hàng ảnh và câu hỏi

- Ảnh câu hỏi hỗ trợ PNG/JPEG/WebP, kéo-thả hoặc chọn tệp; hiện thumbnail, tên tệp, dung lượng và xem trước.
- File ảnh lưu bằng IndexedDB; localStorage chỉ giữ dữ liệu lớp, thiết lập và mã tham chiếu.
- Văn bản câu hỏi được nhập trực tiếp; một câu hỏi có thể dùng văn bản, ảnh hoặc cả hai.
- Mỗi bộ nội dung có tên, lớp áp dụng, loại bài, thứ tự và trạng thái bật/tắt.
- Có sao lưu/khôi phục JSON cho dữ liệu văn bản; phần ảnh sẽ được đóng gói theo cơ chế export/import riêng để không làm hỏng bộ nhớ trình duyệt.

### Ba dạng bài sau khi bị bắt

| Dạng bài | Input của giáo viên | Luồng cho học sinh |
|---|---|---|
| Flashcards | 1–7 thẻ, mỗi thẻ có ảnh hoặc text; đáp án/điều kiện hoàn thành | Lật/xem lần lượt; hoàn thành đúng hết thì hiện **Xác nhận thả xuống** để nhân vật quay lại tiếp tục chạy. |
| Quiz 4 lựa chọn | Khung câu hỏi, 1 đáp án đúng, 3 đáp án sai | Bốn lựa chọn được xáo mỗi lượt; đúng thì thả xuống, sai thì ở lại UFO để thử lại. Không cho phép đáp án trùng nhau. |
| Điền khuyết / Anagram / Unjumble | Từ hoặc câu đích, phần bị thiếu/chữ xáo, gợi ý tùy chọn | Gõ hoặc sắp xếp ký tự/từ; kiểm tra không phân biệt hoa-thường theo thiết lập; đúng thì thả xuống, sai thì thử lại. |

Mỗi lượt gọi có thể lấy ngẫu nhiên một câu từ bộ đang bật hoặc đi theo thứ tự. Giáo viên nhìn thấy câu kế tiếp trong bảng điều khiển, không hiển thị trước cho học sinh.

### Hệ thiết kế và dark mode

- Kế thừa các ưu điểm của theme tối từ repo cũ: nền navy sâu, độ tương phản cao, cyan/lime làm màu hành động, panel kính tối và focus state rõ ràng.
- Không giữ các khối hình thô: thay bằng hierarchy rõ, icon nhất quán, card có trạng thái, khoảng trắng hợp lý, animation ngắn và có ý nghĩa.
- Bố cục desktop cố định theo ba vùng: quản lý lớp ở trái, sân khấu ở giữa, nhật ký ở dưới; trên màn hẹp, các panel chuyển thành khu vực thu gọn mà không che nút bắt đầu.
- Không dùng asset của website gốc; UFO, môi trường, hiệu ứng và icon được tự dựng hoặc dùng tài nguyên có quyền sử dụng rõ ràng.
- Có công tắc **Giảm hiệu ứng** cho laptop yếu, tôn trọng `prefers-reduced-motion` và không làm thay đổi luật chơi.

## Lộ trình triển khai

### Giai đoạn 1 — Nền dữ liệu và luật gọi bài

- Chuẩn hóa mô hình `Classroom`, `Student`, `FlightLog`, `Settings`.
- Tạo kho localStorage có migration, dữ liệu mẫu và thao tác quản lý lớp/học sinh.
- Viết logic chọn ngẫu nhiên có/không chống trùng, chọn nhiều bạn và reset vòng.
- Viết test cho các luật chọn.

**Hoàn thành khi:** đổi lớp, sửa danh sách, tải lại trang và gọi ngẫu nhiên đều giữ đúng dữ liệu.

### Giai đoạn 2 — Hệ nội dung học tập

- Xây ngân hàng text/ảnh, metadata và IndexedDB cho ảnh.
- Tạo modal quản lý bộ nội dung, kéo-thả ảnh và xem trước.
- Xây flashcard 1–7 thẻ, quiz bốn đáp án và điền khuyết/anagram/unjumble.
- Liên kết đúng/sai với cảnh thả xuống hoặc thử lại trên UFO.
- Kiểm tra xáo đáp án, dữ liệu thiếu, ảnh hỏng và bộ câu hỏi trống.

**Hoàn thành khi:** giáo viên tự tạo một bộ gồm đủ ba dạng bài và một học sinh hoàn thành được toàn bộ luồng.

### Giai đoạn 3 — Giao diện bám chuẩn website gốc

- Thay toàn bộ layout hiện có bằng header + cột điều khiển + sân khấu + nhật ký.
- Dùng dark mode navy glass, cyan, lime; typography và focus state rõ ràng.
- Thêm modal Quản lý lớp học, nội dung, Hướng dẫn, trạng thái hệ thống, âm thanh/toàn màn hình và Giảm hiệu ứng.
- Rà lại responsive tại 1366×768, 1024×768 và màn hình hẹp.

**Hoàn thành khi:** bố cục gọn, chuyên nghiệp và thao tác quan trọng luôn nhìn thấy ở kích thước laptop.

### Giai đoạn 4 — Cảnh 3D, hành động hài và âm thanh

- Cảnh khu phố 3D tự dựng với học sinh, vật cản, cây, bụi, nước và UFO neon.
- Ba góc camera: toàn cảnh, bám UFO, góc phố.
- State machine quét: đếm ngược → chớp đèn/tia quét → hành động né tránh hài → khóa mục tiêu → tia hút.
- Chuỗi sau khi bắt: mở dạng bài đã chọn → đúng/thả xuống hoặc sai/thử lại → ghi nhật ký.
- Âm thanh Web Audio tự tạo: nhạc tăng nhịp khi quét, SFX riêng, tắt ngay khi giáo viên tắt âm.

**Hoàn thành khi:** mục tiêu chỉ lộ sau khi đếm ngược kết thúc, hành động vui nhộn không gây lag và kết quả bài học điều khiển đúng cảnh tiếp theo.

### Giai đoạn 5 — Kiểm thử và phát hành

- Kiểm tra unit test, type-check, build production và hiệu năng.
- Kiểm tra thủ công: quản lý lớp, nạp ảnh, ba dạng bài, đổi lớp, tắt/bật học sinh, không trùng, nhiều bạn/lượt, reset, reload.
- Kiểm tra Hiệu ứng giảm, tắt âm, bàn phím, lỗi ảnh và sao lưu/khôi phục.
- Cập nhật README, push commit và kiểm tra GitHub Pages.

## Đề xuất tối ưu bổ sung

1. **Chế độ Giáo viên:** một nút mở panel nhỏ để chọn bộ bài và xem câu kế tiếp; học sinh chỉ thấy sân khấu/kết quả, tránh lộ đáp án.
2. **Mức độ kịch tính:** Calm / Standard / Party, thay đổi nhịp quét, âm lượng và số hành động nhưng không đổi luật chọn.
3. **Luồng dự phòng khi thiếu nội dung:** nếu chưa có bộ câu hỏi, sau khi bắt vẫn công bố tên và cho phép thả xuống; game không bị kẹt.
4. **Chỉ báo tiến độ bài:** ví dụ `3 / 5 thẻ`, giúp học sinh hiểu còn bao nhiêu bước để được thả xuống.
5. **Kiểm tra dữ liệu trước khi chơi:** báo rõ ảnh bị lỗi, quiz chưa đủ 4 đáp án, hoặc lớp không còn học sinh sẵn sàng.

## Quyết định bổ sung — Quiz Ảnh → Từ (03-11-2026)

Quiz không nhập sẵn bốn đáp án. Giáo viên nạp một **Kho Input** gồm các cặp `ảnh | từ tương ứng` (mỗi dòng một cặp). Mỗi lượt Quiz chọn một cặp: ảnh là câu hỏi lớn ở **bên trái**, từ tương ứng là đáp án đúng; ba từ của ba cặp khác được lấy ngẫu nhiên làm đáp án nhiễu. Bốn từ được xáo vào lưới **2×2 bên phải**. Một kho cần tối thiểu bốn cặp hợp lệ; không đủ thì báo rõ và lượt UFO vẫn hoàn thành, không bị kẹt.

Ba chế độ lượt chơi được lưu trong cài đặt: **Chỉ gọi tên**, **Flashcard**, **Quiz ảnh → từ**. Hai chế độ học tự giới hạn một học sinh mỗi lượt để bài hiện cho đúng người.

## Tiêu chí nghiệm thu

- Có thể quản lý lớp và học sinh bằng giao diện tiếng Việt.
- Dữ liệu chỉ lưu cục bộ trên máy giáo viên.
- Chế độ không gọi trùng hoạt động xuyên suốt một vòng.
- Lượt gọi có đếm ngược, hành động né tránh hài hước, tia quét và công bố sau hiệu ứng UFO.
- Có thể tạo/nhập ảnh hoặc text và dùng đủ Flashcards, Quiz, Điền khuyết/Anagram/Unjumble.
- UI dùng được trên laptop 1366×768, không che nút điều khiển quan trọng và có chế độ Giảm hiệu ứng.
- Không có tên học sinh thật hoặc tài sản sao chép từ website gốc trong repository.


## Kiến trúc bắt buộc — Game Image Upload

Hệ thống ảnh tuân theo đặc tả **Game Image Upload (100+ ảnh cho game giáo dục)** và thay thế phần mô tả IndexedDB trước đó.

### Sáu khối triển khai

1. **Nén ảnh thông minh:** PNG/JPG/WebP được đọc qua canvas, tự nén sang WebP theo kích thước/chất lượng phù hợp; giữ alpha channel để sticker PNG trong suốt không mất nền.
2. **ImageDB (IndexedDB):** ảnh binary và metadata được lưu tách biệt, đủ cho 100+ ảnh và hoạt động offline. localStorage không chứa blob/base64 ảnh trong vận hành thường.
3. **SafeStore:** bọc localStorage/IndexedDB bằng fallback bộ nhớ; nếu trình duyệt, Zalo hoặc private mode chặn storage, game vẫn mở được và báo rõ dữ liệu chỉ tồn tại trong phiên hiện tại.
4. **Tách ảnh khỏi auto-save:** chỉnh text/câu hỏi chỉ lưu metadata; thao tác gõ không tuần tự hoá lại hàng trăm ảnh.
5. **Kho ảnh:** kéo-thả, upload hàng loạt, thumbnail, đếm ảnh/dung lượng, cảnh báo thiếu asset, xóa hàng loạt có xác nhận, và cập nhật sân chơi ngay khi asset đổi.
6. **Backup/Restore một file:** export JSON bao gồm dữ liệu, cài đặt, metadata và ảnh mã hóa Base64. Restore kiểm tra schema trước, hỏi xác nhận trước khi ghi đè, ghi ImageDB trước rồi mới cập nhật metadata.

### Tương thích và bảo vệ dữ liệu

- Chạy migration từ dữ liệu localStorage cũ sang IndexedDB khi phát hiện bản cũ; migration có cờ hoàn tất, có thể chạy lại an toàn.
- Chuẩn hóa ID ảnh: trim khoảng trắng, nhận diện tên như `12.PNG` thành ID `12`, chặn ID trùng.
- Từ chối HEIC và file không phải ảnh với danh sách lỗi từng tệp; không làm hỏng những ảnh hợp lệ đã nhập cùng đợt.
- Kiểm tra quota bằng `navigator.storage.estimate()` khi trình duyệt hỗ trợ; cảnh báo đỏ khi dung lượng thấp/hết chỗ.
- Restore file sai định dạng không được phép thay đổi bất kỳ dữ liệu hiện tại nào.
- Settings modal phải scroll độc lập, responsive và không tràn màn hình.

### Kiểm thử bắt buộc

1. Upload PNG trong suốt, JPG và WebP; kiểm tra alpha/thumbnail/dung lượng.
2. Upload 100+ ảnh; reload vẫn có đủ asset và UI không lag khi sửa text.
3. Backup → xóa dữ liệu → restore → reload: dữ liệu lớp, cài đặt, metadata và ảnh đều trở lại.
4. Restore file sai: dữ liệu hiện tại không đổi.
5. Chặn storage/mô phỏng lỗi IndexedDB: game vào SafeStore và vẫn không trắng màn hình.
