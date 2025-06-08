# Hệ Thống Quản Lý Học Viện (UniSys)

Hệ thống quản lý học viện toàn diện bao gồm quản lý học sinh, giáo viên, lớp học, điểm số, điểm danh và các chức năng hành chính khác.

## 🏗️ Kiến Trúc Hệ Thống

Dự án được chia thành 2 phần chính:

- **Backend**: Spring Boot 3.4.4 REST API (Java 17)
- **Frontend**: Vue.js 3 + TypeScript + Ant Design Vue

## 📋 Yêu Cầu Hệ Thống

### Backend

- Java 17 hoặc cao hơn
- Maven 3.6+
- MySQL 8.0+ (hoặc H2 Database cho development)
- Docker (tùy chọn)

### Frontend

- Node.js 16+
- npm hoặc yarn
- Trình duyệt hiện đại hỗ trợ ES6+

## 🚀 Cài Đặt và Chạy

### 1. Clone Repository

```powershell
git clone <repository-url>
cd he-thong-hoc-vien
```

### 2. Backend Setup

```powershell
cd backend
```

#### Cấu hình Database

**Sử dụng MySQL:**

1. Tạo database MySQL:

```sql
CREATE DATABASE unisys;
```
2. Thay đổi cấu hình trong `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/unisys?useSSL=false&serverTimezone=UTC
    username: your_username
    password: your_password
```


#### Chạy Backend

```powershell
# Cài đặt dependencies
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

#### Sử dụng Docker (Tùy chọn)

```powershell
# Chạy với Docker Compose
docker-compose up -d

# Hoặc build và chạy Docker image
docker build -t unisys-backend .
docker run -p 8080:8080 unisys-backend
```

Backend sẽ chạy tại: `http://localhost:8080/api/v1`

### 3. Frontend Setup

```powershell
cd frontend
```

#### Cài đặt Dependencies

```powershell
npm install
```

#### Cấu hình API Endpoint

Tạo file `.env` trong thư mục frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

#### Chạy Frontend

```powershell
# Development mode
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 👥 Phân Quyền Hệ Thống

### 🎓 Admin (Quản trị viên)

- Quản lý tài khoản người dùng (học sinh, giáo viên)
- Quản lý lớp học và môn học
- Phân công giáo viên cho lớp học
- Quản lý lớp chủ nhiệm
- Quản lý học phí và thông báo
- Tạo và quản lý kỳ thi
- Xem báo cáo tổng quan hệ thống

### 👨‍🏫 Teacher (Giáo viên)

- Xem và chỉnh sửa thông tin cá nhân
- Quản lý lớp học được phân công
- Điểm danh học sinh theo buổi học
- Nhập và quản lý điểm số
- Xem thông báo từ hệ thống
- Quản lý lớp chủ nhiệm (nếu được phân công)

### 👨‍🎓 Student (Học sinh)

- Xem và cập nhật thông tin cá nhân
- Xem điểm số theo từng môn học
- Xem lịch sử điểm danh
- Xem thông báo từ trường
- Xem thông tin học phí và tình trạng thanh toán

## 🔧 Công Nghệ Sử Dụng

### Backend

- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Database**: MySQL 8.0 / H2 Database
- **ORM**: Spring Data JPA
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI/Swagger (có thể)
- **Build Tool**: Maven
- **Containerization**: Docker

### Frontend

- **Framework**: Vue.js 3.5.13
- **Language**: TypeScript 5.7.2
- **UI Library**: Ant Design Vue 4.2.6
- **Styling**: TailwindCSS 4.1.3
- **State Management**: Pinia 3.0.2
- **HTTP Client**: Axios 1.9.0
- **Authentication**: JWT Decode 4.0.0
- **Routing**: Vue Router 4.5.0
- **Toast Notifications**: Vue3 Toastify 0.2.8
- **Build Tool**: Vite
- **Storage**: Firebase (Upload ảnh)

## 📁 Cấu Trúc Dự Án

```
he-thong-hoc-vien/
├── backend/                     # Spring Boot API
│   ├── src/main/
│   │   ├── java/
│   │   │   ├── application/     # Main application class
│   │   │   ├── configuration/   # Spring configuration
│   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── business/    # Business logic controllers
│   │   │   │   │   ├── admin/   # Admin controllers
│   │   │   │   │   ├── teacher/ # Teacher controllers
│   │   │   │   │   └── student/ # Student controllers
│   │   │   │   └── general/     # General controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── request/     # Request DTOs
│   │   │   │   └── response/    # Response DTOs
│   │   │   ├── exception/       # Exception handling
│   │   │   ├── model/           # JPA Entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── service/         # Business services
│   │   │   ├── seeder/          # Database seeders
│   │   │   └── util/            # Utility classes
│   │   └── resources/
│   │       ├── application.yaml      # Main config
│   │       ├── application-docker.yaml # Docker config
│   │       └── banner.txt       # Spring Boot banner
│   ├── docker-compose.yml       # Docker compose setup
│   ├── Dockerfile              # Docker build config
│   └── pom.xml                 # Maven dependencies
│
├── frontend/                   # Vue.js application
│   ├── src/
│   │   ├── views/              # Page components
│   │   │   ├── admin/          # Admin interface
│   │   │   ├── teacher/        # Teacher interface
│   │   │   └── student/        # Student interface
│   │   ├── routers/            # Vue Router setup
│   │   ├── services/           # API services
│   │   ├── stores/             # Pinia state management
│   │   ├── assets/             # Static assets
│   │   └── App.vue             # Root component
│   ├── public/                 # Public assets
│   ├── package.json            # npm dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript config
│
└── README.md                   # Tài liệu dự án
```

## 🌟 Tính Năng Chính

### 🔐 Xác Thực & Bảo Mật

- Đăng nhập với JWT authentication
- Phân quyền theo vai trò (Admin/Teacher/Student)
- Quản lý session và refresh token
- Bảo mật API endpoints

### 👥 Quản Lý Người Dùng

- Đăng ký tài khoản cho học sinh, giáo viên
- Quản lý thông tin cá nhân
- Đổi mật khẩu và cập nhật profile
- Upload và quản lý ảnh đại diện

### 🏫 Quản Lý Học Vụ

- Tạo và quản lý lớp học, môn học
- Phân công giáo viên cho từng lớp
- Quản lý danh sách học sinh trong lớp
- Quản lý lớp chủ nhiệm
- Tạo thời khóa biểu

### 📊 Quản Lý Điểm Số

- Tạo các kỳ thi (giữa kỳ, cuối kỳ, kiểm tra...)
- Nhập điểm theo lớp và môn học
- Xem và xuất báo cáo điểm số
- Tính toán điểm trung bình

### ✅ Hệ Thống Điểm Danh

- Điểm danh học sinh theo buổi học
- Ghi nhận lý do vắng mặt
- Cảnh báo học sinh vắng học nhiều
- Thống kê tỷ lệ đi học

### 💰 Quản Lý Tài Chính

- Thiết lập học phí theo lớp/khóa học
- Theo dõi tình trạng đóng học phí
- Gửi thông báo nhắc nhở
- Báo cáo thu chi

### 📢 Hệ Thống Thông Báo

- Gửi thông báo từ nhà trường
- Phân loại thông báo theo đối tượng
- Đánh dấu đã đọc/chưa đọc
- Lịch sử thông báo

## 🔗 API Endpoints

### Authentication

```
POST /api/v1/auth/login          # Đăng nhập
POST /api/v1/auth/logout         # Đăng xuất
POST /api/v1/auth/refresh        # Refresh token
```

### Admin Endpoints

```
GET  /api/v1/admin/users         # Danh sách người dùng
POST /api/v1/admin/users         # Tạo người dùng mới
PUT  /api/v1/admin/users/{id}    # Cập nhật người dùng
DELETE /api/v1/admin/users/{id}  # Xóa người dùng
```

### Student & Teacher Endpoints

```
GET  /api/v1/student/profile     # Thông tin học sinh
GET  /api/v1/student/grades      # Xem điểm số
GET  /api/v1/teacher/classes     # Lớp học của giáo viên
POST /api/v1/teacher/attendance  # Điểm danh
```

## 🔐 Authentication

Hệ thống sử dụng JWT (JSON Web Token):

```javascript
// Login request
POST /api/v1/auth/login
{
  "username": "student123",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "username": "student123",
    "role": "STUDENT"
  }
}

// Use token in requests
Authorization: Bearer <jwt_token>
```

## 📱 Responsive Design

Giao diện được thiết kế responsive, tương thích với:

- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (320px - 767px)

## 🐳 Docker Deployment

### Development

```powershell
# Chạy cả backend và database
docker-compose up -d
```

### Production

```powershell
# Build images
docker build -t unisys-backend ./backend
docker build -t unisys-frontend ./frontend

# Run containers
docker run -d -p 8080:8080 unisys-backend
docker run -d -p 80:80 unisys-frontend
```

## 🧪 Testing

### Backend Testing

```powershell
cd backend
mvn test
```

### Frontend Testing

```powershell
cd frontend
npm run test
```

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch:
   ```powershell
   git checkout -b feature/TenTinhNang
   ```
3. Commit changes:
   ```powershell
   git commit -m "Thêm tính năng XYZ"
   ```
4. Push to branch:
   ```powershell
   git push origin feature/TenTinhNang
   ```
5. Tạo Pull Request

## 🔧 Troubleshooting

### Lỗi thường gặp

**Backend không khởi động:**

- Kiểm tra Java version: `java -version`
- Kiểm tra MySQL connection
- Xem log trong `target/` folder

**Frontend build lỗi:**

- Xóa `node_modules` và chạy lại `npm install`
- Kiểm tra Node.js version: `node --version`
- Clear cache: `npm run dev -- --force`

**Database connection issues:**

- Kiểm tra MySQL service đang chạy
- Verify database credentials trong `application.yaml`
- Kiểm tra firewall settings

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra [Issues](../../issues) đã có sẵn
2. Tạo issue mới với:
   - Mô tả chi tiết lỗi
   - Steps to reproduce
   - Environment details
   - Screenshots (nếu có)

## 📝 License

Dự án này được phát hành dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 🚧 Roadmap

### Phase 1 (Hiện tại)

- [x] Authentication & Authorization
- [x] User Management
- [x] Class Management
- [x] Grade Management
- [x] Attendance System

### Phase 2 (Sắp tới)

- [ ] Real-time notifications với WebSocket
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced reporting & analytics
- [ ] Email notifications
- [ ] SMS integration

### Phase 3 (Tương lai)

- [ ] AI-powered insights
- [ ] Integration với các hệ thống khác
- [ ] Multi-tenant support
- [ ] Advanced security features

---
**Phiên bản:** 0.0.1-SNAPSHOT  
**Cập nhật lần cuối:** 08/06/2025  
**Tác giả:** Mai Anh Hoàng  
**Email:** maianhhoang31072003@gmail.com  
**Số điện thoại:** 0867254603
