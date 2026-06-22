# HUEdu-CTA - Ứng Dụng Hỗ Trợ Giao Tiếp AAC (Dành Cho Trẻ Tự Kỷ)

HUEdu-CTA (HUEdu - Communication Training App) là một ứng dụng di động Hỗ trợ Giao tiếp Thay thế và Bổ sung (AAC - Augmentative and Alternative Communication) được thiết kế đặc biệt nhằm hỗ trợ trẻ em tự kỷ và trẻ gặp khó khăn trong ngôn ngữ phát triển kỹ năng giao tiếp.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-0.76.x-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)

## Tính Năng Nổi Bật

- **Bảng Giao Tiếp Trực Tiếp:** Chọn một thẻ hình ảnh, ứng dụng sẽ phát âm ngay lập tức.
- **Bảng Ghép Câu:** Cho phép ghép chuỗi nhiều từ vựng để tạo thành câu hoàn chỉnh, hỗ trợ phát triển ngôn ngữ tự nhiên.
- **Thường Dùng & Yêu Thích:** Tự động thống kê và ghi nhớ các thẻ được dùng nhiều nhất, giúp tiết kiệm thời gian chọn thẻ cho trẻ.
- **Quản Lý Bằng Mã PIN:** "Cửa ải phụ huynh" bảo vệ cài đặt, tránh việc trẻ vô tình thay đổi dữ liệu hoặc thiết lập hệ thống.
- **Tùy Biến Thẻ & Giao Diện:** 
  - Thêm, sửa, xóa các thẻ Hoạt động và Từ vựng.
  - Tự do thiết lập màu sắc cho từng danh mục.
  - Tùy chỉnh ảnh đại diện, màu nền sáng/tối.
- **Thống Kê Trực Quan:** Báo cáo chi tiết lịch sử và tần suất sử dụng ứng dụng của từng hồ sơ.
- **Đa Ngôn Ngữ & Giọng Đọc:** Hỗ trợ song ngữ (Tiếng Việt & Tiếng Anh), tùy chỉnh tốc độ, cao độ giọng đọc (TTS).
- **Hoạt Động Ngoại Tuyến (Offline):** Dữ liệu được lưu trữ an toàn trên thiết bị thông qua SQLite, đảm bảo tốc độ nhanh và không yêu cầu kết nối mạng.

## Công Nghệ Sử Dụng

- **Framework:** React Native, TypeScript.
- **Kiến trúc:** Clean Architecture (Chia lớp Domain, Data, Presentation).
- **Quản lý trạng thái:** Zustand.
- **Giao diện:** React Navigation v7, React Native Paper, Lucide-React-Native.
- **Cơ sở dữ liệu:** SQLite (`react-native-sqlite-storage`).
- **Phát âm:** `react-native-tts`.
- **Đa ngôn ngữ:** `i18next`.

## Hướng Dẫn Cài Đặt (Cho Lập Trình Viên)

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản LTS (>= 18.x).
- **Java Development Kit (JDK)**: Phiên bản 17 (Cần thiết cho React Native mới).
- **Android Studio**: Để cài đặt Android SDK và Emulator.
- Môi trường Android chuẩn bị sẵn sàng biến môi trường (`ANDROID_HOME`).

### 2. Tải và thiết lập dự án
Clone repository về máy:
```bash
git clone https://github.com/khoamai291299/HUEdu-CTA.git
cd HUEdu-CTA
```

Cài đặt các gói phụ thuộc (Dependencies):
```bash
npm install
```

### 3. Chạy ứng dụng trong môi trường phát triển
Đảm bảo đã kết nối với máy ảo Android (Emulator) hoặc điện thoại thật qua USB Debugging.

Chạy Metro Bundler:
```bash
npm start
```

Mở một Terminal khác, thực thi để cài app lên máy:
```bash
npm run android
```

### 4. Xuất file APK (Bản Release)
Để build bản cài đặt chính thức (APK) không cần Metro:

**Trên Windows:**
```powershell
cd android
.\gradlew assembleRelease
cd ..
```
File APK sau khi build sẽ nằm tại đường dẫn: `android\app\build\outputs\apk\release\app-release.apk`

*Ghi chú: Bản APK gốc mới nhất đã được xuất và đính kèm trong repository (`HUEdu-CTA-v1.0.0-final-6.apk`).*

## Tài Liệu & Hướng Dẫn Chi Tiết
Vui lòng tham khảo file `Guide.md` ở thư mục gốc để đọc tài liệu bàn giao dự án chuyên sâu bao gồm cấu trúc, luồng đi và kỹ thuật triển khai.

## Cấp Phép (License)
Dự án được xây dựng cho mục đích hỗ trợ y tế - giáo dục.
