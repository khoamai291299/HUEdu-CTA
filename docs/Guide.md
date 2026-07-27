# Tài Liệu Bàn Giao Kỹ Thuật: HUEdu-CTA

Tài liệu này cung cấp cái nhìn chi tiết về kiến trúc, công nghệ và các quy trình triển khai ứng dụng HUEdu-CTA.

## 1. Tên và Mục Tiêu Đề Tài
- **Tên dự án:** HUEdu-CTA (Ứng dụng Hỗ trợ Giao tiếp AAC)
- **Mục tiêu:** Xây dựng một công cụ AAC (Augmentative and Alternative Communication) hỗ trợ trẻ tự kỷ có rối loạn phát triển ngôn ngữ. Phần mềm giúp trẻ giao tiếp bằng cách biểu đạt ý muốn thông qua việc lựa chọn và ghép các thẻ hình ảnh, sau đó chuyển đổi hình ảnh thành giọng nói (Text-to-Speech). Đồng thời, ứng dụng đi kèm tính năng giám sát và thống kê cho phụ huynh/giáo viên.

## 2. Công Nghệ Sử Dụng
- **Môi trường & Ngôn ngữ:** Node.js, React Native (v0.76), TypeScript.
- **Quản lý trạng thái (State Management):** Zustand - Nhẹ, linh hoạt và không cần boilerplate rườm rà như Redux. Được tách thành nhiều Store chuyên biệt (`useVocabularyStore`, `useActivityStore`, `useSettingsStore`...).
- **Cơ sở dữ liệu (Database):** SQLite thông qua thư viện `react-native-sqlite-storage`. Hoạt động 100% offline trên thiết bị. Cấu trúc bảng (schema) được quản lý chặt chẽ qua hệ thống Migration.
- **Giao diện & UI Component:** React Native Paper (Material Design) và Lucide-React-Native (Icon). Sử dụng cơ chế Auto-Layout Grid (Tính toán cột dựa trên chiều rộng màn hình thiết bị - tự động co giãn 3-6 cột tùy vào việc xoay ngang hay dọc, tối ưu hiển thị cho cả Phone và Tablet/iPad).
- **Phát âm & Âm thanh:** `react-native-tts` (Google Text-to-Speech) phát âm tiếng Việt/Tiếng Anh theo tốc độ và cao độ tùy chỉnh.
- **Đa ngôn ngữ:** `i18next` (Quản lý từ điển Tiếng Việt & Tiếng Anh).

## 3. Cấu Trúc Kiến Trúc (Clean Architecture)
Dự án được phân rã thành 3 lớp riêng biệt để tăng tính bảo trì và mở rộng:
1. **Core:** Các module cốt lõi (Errors, Utils, Base UseCase/Repository, i18n configs).
2. **Domain:** 
   - **Entities:** Định nghĩa các cấu trúc dữ liệu thuần túy (Vocabulary, Activity, Profile...).
   - **Use Cases:** Khai báo quy tắc nghiệp vụ (Business Rules). Ví dụ: `SpeakWordUseCase`, `GetStatisticsUseCase`.
   - **Repositories Interfaces:** Khai báo cổng giao tiếp (Interfaces) mà Data layer cần thực thi.
3. **Data:** 
   - Triển khai kho lưu trữ thực tế (`ActivityRepositoryImpl`, `SettingsRepositoryImpl`...).
   - **Database Services:** Kết nối SQLite, chạy hệ thống Migration (v1, v2, v3...) để cập nhật cấu trúc database khi ứng dụng nâng cấp.
4. **Presentation:**
   - **UI Components:** Thiết kế các view, hook (custom hook như `useTts`, `useResponsiveGrid`).
   - **Screens & Navigation:** Điều hướng bằng `react-navigation`.
   - Lớp này gọi trực tiếp các UseCase để lấy dữ liệu thông qua cơ chế Dependency Injection (DI) thủ công đơn giản ở file `services.ts`.

## 4. Các Chức Năng Chính
1. **Giao Tiếp Chính (Direct Play):** Dựa vào bảng `activities` (Hoạt động). Khi trẻ chạm vào hình ảnh, hệ thống tự động phát âm câu lệnh tức thì (Ví dụ: Chạm vào ly nước -> Phát âm "Tôi muốn uống nước").
2. **Ghép Câu (Sentence Board):** Dựa vào bảng `vocabulary` (Từ vựng). Cho phép trẻ bấm liên tiếp các thẻ tạo thành một dải câu dài trên thanh "Sentence Bar" rồi phát âm cả câu.
3. **Mục Thường Dùng & Yêu Thích:** 
   - Thường dùng tự động bóc tách từ `usage_history` để mang 10-20 hoạt động tần suất cao nhất lên đầu.
   - Yêu thích được định nghĩa bởi phụ huynh.
4. **Cửa Ải Phụ Huynh (Parent Gate):** Bắt buộc nhập mã PIN 4 số. Xử lý logic chặn thao tác quá nhiều lần, bảo vệ dữ liệu.
5. **Thống Kê:** Cung cấp biểu đồ usage theo tuần, tần suất từ dùng nhiều nhất của từng bé.
6. **Sao lưu (Backup):** Cho phép xuất/nhập toàn bộ dữ liệu SQLite thông qua JSON để sao lưu.
7. **Responsive & Chủ đề (Themes):** Hỗ trợ linh hoạt các kích thước màn hình (Phone, Tablet, iPad), cá nhân hóa màu sắc hệ thống và màu da nhân vật đại diện.

## 5. Kỹ Thuật Triển Khai
- **Migrate Cơ sở dữ liệu an toàn:** Thay vì xóa sạch dữ liệu mỗi khi cập nhật cấu trúc, hệ thống có file `MigrationRunner.ts` check version PRAGMA SQLite. Nếu version tăng, nó sẽ chạy tiếp các truy vấn SQL bổ sung để giữ nguyên dữ liệu cũ.
- **Tối ưu vòng đời Component:** Dùng `useFocusEffect` để tự động fetch data ngầm khi màn hình được người dùng mở lại (đảm bảo tính Real-Time của Thống Kê và Thường Dùng).

## 6. Hướng Dẫn Build APK Thực Tế (Bản Cập Nhật)
Để cấu hình và trích xuất file APK chuẩn 100% tính năng và giao diện hiện hành:

### Môi trường cần chuẩn bị:
1. Đã cài **Node.js** (>= 18.x).
2. Đã tải **Android Studio** (cài đặt Android SDK 34 hoặc tương thích). Thiết lập đường dẫn `ANDROID_HOME`.
3. Có kết nối mạng ổn định để tải các thư viện Gradle.

### Các bước chạy và trích xuất:
**Bước 1:** Mở Terminal / PowerShell, tải source code:
```bash
git clone https://github.com/khoamai291299/HUEdu-CTA.git
cd HUEdu-CTA
```

**Bước 2:** Cài đặt toàn bộ thư viện:
```bash
npm install
```

**Bước 3:** Tiến hành build mã nguồn thành file APK (Release):
Mở cửa sổ dòng lệnh tại thư mục gốc của dự án `HUEdu-CTA`:
```powershell
cd android
./gradlew assembleRelease   # (Nếu trên Mac/Linux/Git Bash)
.\gradlew assembleRelease   # (Nếu trên Windows PowerShell)
cd ..
```
*Lưu ý: Quá trình này có thể tốn 2-5 phút cho lần chạy đầu tiên.*

**Thành quả:**
File `app-release.apk` cuối cùng sẽ nằm tại:
`HUEdu-CTA\android\app\build\outputs\apk\release\app-release.apk`
Bạn có thể chép trực tiếp file APK này sang thiết bị di động hoặc máy tính bảng Android để cài đặt trải nghiệm 100% chức năng.
