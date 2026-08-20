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
  - Tùy chỉnh ảnh đại diện và màu nền sáng/tối.
- **Tương Thích Mọi Thiết Bị:** Tự động co giãn cấu trúc lưới hiển thị hoàn hảo trên Điện thoại (Phone), Máy tính bảng (Tablet) và iPad.
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

## Hướng Dẫn Cài Đặt và Build APK

Để tự tay trích xuất file APK chuẩn với 100% chức năng:

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản LTS (>= 18.x).
- **Java Development Kit (JDK)**: Phiên bản 17 (Cần thiết cho React Native mới).
- **Android Studio**: Để cài đặt Android SDK 34 và biến môi trường (`ANDROID_HOME`).

### 2. Tải và thiết lập dự án
Clone repository về máy:
```bash
git clone https://github.com/khoamai291299/HUEdu-CTA.git
cd HUEdu-CTA
```

Cài đặt các gói phụ thuộc (Dependencies):
```bash
npm install --legacy-peer-deps
```
*(Bắt buộc dùng `--legacy-peer-deps`: `lucide-react-native` khai báo peer `react ^18` trong khi dự án dùng React 19, `npm install` thường sẽ dừng với lỗi ERESOLVE.)*

> **Về thư mục `patches/`:** `react-native-audio-recorder-player@3.6.14` gọi `currentActivity` trần —
> API này không còn khả dụng cho lớp con trong React Native 0.85, khiến `assembleRelease` fail ở
> `:react-native-audio-recorder-player:compileReleaseKotlin`. Bản vá trong `patches/` sửa lại thành
> `reactContext.currentActivity` và được `patch-package` tự áp dụng qua script `postinstall`.
> **Không xoá thư mục `patches/`** — thiếu nó thì dự án không build được APK.

### 3. Xuất file APK (Bản Release)
Mở một Terminal / PowerShell tại thư mục gốc và chạy các lệnh sau:
```powershell
cd android
.\gradlew assembleRelease
cd ..
```
*(Nếu bạn dùng Mac/Linux, hãy dùng `./gradlew assembleRelease`)*

File APK sau khi build hoàn tất sẽ nằm tại đường dẫn: 
`android/app/build/outputs/apk/release/HUEdu-CTA-v<versionName>.apk`

**Yêu cầu môi trường đã kiểm chứng (macOS):** JDK 21, Android SDK Platform 36, Build-Tools 36.0.0,
NDK 27.1.12297006 (Gradle tự tải bù platform/NDK còn thiếu nếu đã chấp nhận license SDK).

**Về việc ký (signing):** nếu chưa có `android/app/my-release-key.keystore`, build sẽ tự ký bằng
debug key để vẫn xuất được APK cài trực tiếp lên máy Android phục vụ test nội bộ. Khi cần phát hành
thật, tạo keystore rồi đặt đúng tên khai báo trong `android/gradle.properties`:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

## Tài Liệu & Hướng Dẫn Chi Tiết
- Vui lòng tham khảo file `Guide.md` để hiểu sâu về kỹ thuật, kiến trúc và luồng dữ liệu.
- Xem file `Report.md` để có báo cáo đầy đủ về toàn bộ đề tài.

## Cấp Phép (License)
Dự án được xây dựng cho mục đích hỗ trợ y tế - giáo dục.

