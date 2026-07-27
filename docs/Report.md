# BÁO CÁO TỔNG KẾT ĐỀ TÀI: HUEdu-CTA

## 1. Giới Thiệu Chung Lĩnh Vực Đề Tài
**HUEdu-CTA (HUEdu - Communication Training App)** là một phần mềm trên nền tảng thiết bị di động (Mobile Application) thuộc lĩnh vực y tế số và giáo dục đặc biệt. Đề tài tập trung vào việc nghiên cứu và phát triển một hệ thống AAC (Augmentative and Alternative Communication - Giao tiếp Thay thế và Bổ sung) dành cho người gặp khiếm khuyết về ngôn ngữ hoặc không có khả năng sử dụng ngôn ngữ nói.

Nhóm đối tượng đích của đề tài tập trung vào **trẻ em có hội chứng tự kỷ (Autism Spectrum Disorder - ASD)**, trẻ chậm phát triển ngôn ngữ, người bị tổn thương chức năng phát âm hoặc đang trong quá trình trị liệu ngôn ngữ.

### 1.1. Mục tiêu cốt lõi
- Xóa bỏ rào cản giao tiếp bằng việc số hóa các thẻ hình ảnh giao tiếp truyền thống (PECS - Picture Exchange Communication System) lên thiết bị điện tử di động.
- Cung cấp cho trẻ một "giọng nói nhân tạo" thông qua cơ chế Text-To-Speech (TTS), giúp bé tự do thể hiện mong muốn và nhu cầu tức thời.
- Tạo ra công cụ quản lý toàn diện giúp các bậc phụ huynh và giáo viên có thể giám sát lộ trình học tập, thống kê tần suất giao tiếp và tối ưu hóa các chủ đề thường dùng cho trẻ.

## 2. Tính Năng Hoàn Chỉnh Của Hệ Thống

Sau quá trình phát triển, ứng dụng đã ra mắt một hệ thống các tính năng hoàn thiện được phân bổ theo 2 vai trò chính: Trẻ em và Phụ huynh/Người bảo hộ.

### Dành cho Trẻ (Người sử dụng AAC)
- **Giao Tiếp Bằng Hình Ảnh Trực Tiếp:** Lựa chọn thẻ hình theo từng chủ đề (Hoạt động, Món ăn, Cảm xúc...), chạm vào hình để ứng dụng phát âm to, rõ ràng lệnh tương ứng.
- **Bảng Ghép Từ Tạo Câu (Sentence Building):** Hỗ trợ xây dựng tư duy ngữ pháp. Thay vì chỉ nói một từ, trẻ có thể chọn tuần tự "Tôi muốn" + "Uống" + "Nước" đưa vào thanh Sentence Bar để tạo ra một câu hoàn chỉnh và phát âm cả câu.
- **Hình Ảnh Trực Quan & Biểu Tượng Cảm Xúc (ARASAAC):** Tích hợp tiêu chuẩn hình ảnh y tế quốc tế ARASAAC giúp trẻ nhanh chóng nhận biết hình khối. Thiết kế hệ thống tương thích tốt cho trẻ (Nút bấm lớn, thiết kế màu sắc tương phản rõ ràng).
- **Nhân Vật Đại Diện & Cá Nhân Hóa:** Tùy chọn giao diện nhân vật đáng yêu, thay đổi màu da để phù hợp với từng cá nhân.
- **Tự Động Mở Rộng Kích Thước (Responsive Grid):** Tự động dàn trang một cách thẩm mỹ bất kể trẻ dùng ứng dụng trên màn hình nhỏ của điện thoại hay không gian rộng lớn của các loại iPad, Máy tính bảng.

### Dành cho Phụ huynh / Giáo viên (Quản trị hệ thống)
- **Cửa Ải Phụ Huynh (Parent Gate):** Lớp bảo vệ bằng mã PIN an toàn để ngăn chặn việc bé vô tình vào phần Cài đặt và xóa dữ liệu.
- **Hệ Thống Thống Kê & Báo Cáo:** 
  - Xem tần suất sử dụng của trẻ qua biểu đồ cột tự động vẽ theo tuần.
  - Phân tích top những từ vựng được trẻ bấm nhiều nhất để nắm bắt được xu hướng sở thích hoặc sự quan tâm của trẻ trong giai đoạn hiện tại.
- **Quản Trị Cơ Sở Dữ Liệu:** Thêm thẻ hoạt động mới, tự tải lên hình ảnh từ thiết bị, tự nhập đoạn chữ để ứng dụng tự phát âm. Sửa và xóa các mục không cần thiết.
- **Chế Độ Yêu Thích & Thường Dùng:** Tự động xếp loại để đẩy các thẻ trẻ dùng nhiều nhất lên đầu, giúp tối giản thao tác.
- **Quản lý Giọng Đọc (TTS):** Tuỳ chỉnh tốc độ phát âm chậm/nhanh, cao độ âm thanh và lựa chọn đa ngôn ngữ (Tiếng Việt, Tiếng Anh).
- **Sao lưu dữ liệu:** Cho phép lấy toàn bộ dữ liệu ra và lưu trữ một cách an toàn để đảm bảo không mất công thiết lập lại cấu trúc thẻ.

## 3. Kiến Trúc Tổ Chức Và Công Nghệ Sử Dụng

### 3.1. Nền tảng Công nghệ
Đề tài sử dụng **React Native (phiên bản 0.76)** kết hợp **TypeScript** làm công nghệ lõi. Lựa chọn này giúp hệ thống hoạt động với hiệu suất ngang bằng ứng dụng Native thuần túy nhưng tốc độ phát triển và bảo trì nhanh chóng hơn, đồng thời tận dụng hệ sinh thái phong phú của JavaScript/TypeScript.

### 3.2. Quản lý trạng thái (State Management)
Ứng dụng sử dụng **Zustand** thay cho Redux. Hệ thống state được chia nhỏ logic thành nhiều kho (stores) độc lập: `useVocabularyStore`, `useSettingsStore`, `useActivityStore`. Việc chia cắt này giúp kiểm soát lỗi tốt hơn, hạn chế các vòng lặp re-render không đáng có và tối giản boilerplate code.

### 3.3. Lưu trữ Dữ liệu (Offline-First Storage)
Một trong những yêu cầu bắt buộc của AAC là tính di động ở mọi nơi kể cả nơi không có wifi. Dự án đã triển khai **SQLite** (qua module `react-native-sqlite-storage`) làm cơ sở dữ liệu ngầm cho mọi hoạt động lưu trữ. 
- Toàn bộ ảnh chụp, dữ liệu thống kê, và thiết lập của trẻ đều được lưu thẳng vào ổ cứng điện thoại dưới dạng các bảng RDBMS.
- Ứng dụng tự động xử lý Migration Schema khi nâng cấp ứng dụng.

### 3.4. Kiến trúc Hệ thống: Clean Architecture
Dự án được phân rã lớp nghiêm ngặt thành 3 thành phần chính:
1. **Lớp Domain:** Chứa các nguyên tắc cốt lõi, Entities (Thực thể mô phỏng), Interfaces và các Use Cases mô tả các luồng hành động kinh doanh (Business logic).
2. **Lớp Data:** Là nơi giao tiếp với SQLite DB. Nó triển khai (implement) lại các Interface của lớp Domain, xử lý việc chạy mã SQL thô hoặc ORM để truy xuất, cập nhật dữ liệu.
3. **Lớp Presentation:** Lớp giao diện chứa React Components, các Navigation Screens, Custom Hooks. Lớp này chỉ nhận dữ liệu đã được xử lý từ Use Case thông qua cơ chế Dependency Injection (DI).

### 3.5. Một số thư viện nổi bật khác
- **UI System:** `react-native-paper` cung cấp bộ Material Design chuẩn mực.
- **Text-to-Speech:** `react-native-tts` làm cầu nối gọi trực tiếp hệ thống phát âm AI của Google (Google TTS) từ hệ điều hành.
- **Đa ngôn ngữ:** Thư viện `i18next` và `react-i18next`.

## 4. Kết Quả Đạt Được Về Mặt Kỹ Thuật
1. Hoàn thành hệ thống AAC 100% chức năng thực tế, hoạt động ổn định và mượt mà trên môi trường Android thực.
2. Xây dựng thành công hệ thống Auto-Grid Layout, giao diện tự động co giãn lưới, đáp ứng tỉ lệ khung hình (Aspect Ratio) hoàn hảo trên cả Mobile (dọc) và iPad/Tablet (ngang hoặc dọc).
3. Kiến trúc dự án minh bạch, sẵn sàng phục vụ cho việc mở rộng quy mô dữ liệu sau này mà không cần đập bỏ xây lại.
4. Quá trình đóng gói tự động hóa qua CLI (`gradlew assembleRelease`) chạy tốt và sinh ra file APK chuẩn chỉ.

## 5. Hướng Phát Triển Tiếp Theo (Future Work)
- Bổ sung hệ thống tải các "Gói từ vựng mẫu" từ máy chủ Cloud (Firebase/AWS) dành riêng cho các giáo viên chia sẻ giáo án giao tiếp.
- Mở rộng thuật toán phân tích giọng điệu (Speech-To-Text AI) để ứng dụng có thể "nghe" phản xạ của trẻ.
- Phát hành trên nền tảng iOS / App Store.

---
**Dự án HUEdu-CTA** đánh dấu sự giao thoa mạnh mẽ giữa công nghệ phần mềm hiện đại và giá trị nhân văn, trực tiếp giúp các em nhỏ kém may mắn trong giao tiếp có thể vượt qua rào cản ngôn ngữ.
