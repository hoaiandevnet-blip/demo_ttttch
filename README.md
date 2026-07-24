# Demo phần mềm TTTTCH

Bản web app mô phỏng theo video demo: hệ thống quản trị tài khoản, phân quyền, hồ sơ cán bộ và quản lý tài sản.

## Cách chạy bằng Docker
Ứng dụng có thể chạy bằng Docker Compose gồm 2 container:

- `ttttch-app`: web app Node.js 24 LTS
- `ttttch-postgres`: PostgreSQL chạy trong Docker

Ở lần chạy đầu tiên, PostgreSQL Docker sẽ tự nạp file `ttttch_production_bootstrap.sql` để tạo bảng, module, quyền và tài khoản admin mặc định.

Chạy lần đầu:

```bash
docker compose up --build
```

Mở phần mềm tại:

```text
http://127.0.0.1:3000/
```

PostgreSQL trong Docker được mở ra máy Mac tại port `5433`, dùng khi cần kết nối DBeaver:

```text
Host: 127.0.0.1
Port: 5433
Database: ttttch_demo
User: ttttch
Password: ttttch_password
```

Tắt hệ thống Docker:

```bash
docker compose down
```

Xóa luôn dữ liệu database Docker để dựng lại từ đầu:

```bash
docker compose down -v
```

## Chính sách upload file
Hệ thống giới hạn file tải lên theo từng nghiệp vụ:

- Biên bản bàn giao: chỉ nhận `.doc`, `.docx`, `.png`, `.jpg`, `.jpeg`, `.webp`, tối đa 6 MB.
- Ảnh hồ sơ cán bộ: chỉ nhận `.png`, `.jpg`, `.jpeg`, `.webp`, tối đa 2 MB.
- File Excel nhập nhanh: chỉ nhận `.xlsx`, `.xls`, tối đa 5 MB.

Server kiểm tra tên file, đuôi file, MIME, dung lượng và chữ ký file trước khi lưu. Client cũng kiểm tra trước để báo lỗi sớm cho người dùng.

## Cách chạy không dùng Docker
Chạy server Node.js trực tiếp:

```bash
npm install
npm run dev
```

Mặc định ứng dụng chạy tại `http://127.0.0.1:3000/`.

## Cấu hình database
File cấu hình kết nối nằm ở `.env`:

```env
DATABASE_URL=postgres://ten_user:mat_khau@dia_chi_server:5432/ten_database
PORT=3000
```

Khi chuyển sang server PostgreSQL mới, chỉ cần đổi `DATABASE_URL` sang thông tin database do bên server cung cấp.

Khi deploy trên Render hoặc server production, cần cấu hình biến môi trường:

```env
NODE_ENV=production
DATABASE_URL=postgres://ten_user:mat_khau@dia_chi_server:5432/ten_database
PORT=10000
```

Nếu PostgreSQL server bắt buộc SSL, giữ mặc định production hoặc thêm:

```env
PGSSLMODE=require
```

Nếu PostgreSQL server nội bộ không dùng SSL, thêm:

```env
PGSSLMODE=disable
```

## Dựng database server mới
Nếu cần dựng hệ thống mới ổn định, không mang theo dữ liệu test, dùng file:

```bash
ttttch_production_bootstrap.sql
```

File này tạo đầy đủ bảng, dữ liệu nền bắt buộc, module, quyền và tài khoản admin mặc định.

Chạy trên server PostgreSQL:

```bash
psql -h DIA_CHI_SERVER -p 5432 -U TEN_USER -d TEN_DATABASE -f ttttch_production_bootstrap.sql
```

Tài khoản đăng nhập ban đầu:

```text
admin / 123456
```

Sau khi đăng nhập lần đầu nên đổi mật khẩu admin ngay.

## Cấu trúc
- `index.html`: giao diện chính
- `assets/css/style.css`: style/responsive
- `assets/js/app.js`: dữ liệu mẫu và chức năng tương tác
- `server/index.js`: API nghiệp vụ
- `server/db.js`: cấu hình kết nối PostgreSQL
- `ttttch_production_bootstrap.sql`: dựng database mới cho môi trường thật

## Chức năng đã dựng
- Màn hình đăng nhập theo tài khoản mẫu
- Sidebar 3 phân hệ
- Danh sách tài khoản, tìm kiếm, lọc trạng thái
- Modal tạo/sửa tài khoản, khóa/mở khóa tài khoản
- Phân quyền theo người dùng và lưu thay đổi trong phiên demo
- Hồ sơ cán bộ theo tab và lưu dữ liệu đã nhập
- Quản lý tài sản: tiếp nhận, danh sách, lập mới, chỉnh sửa, kiểm kê mẫu

## Tài khoản đăng nhập mẫu
- `admin` / `123456`
- `nguyenvana` / `123456`
- `tranthib` / `123456`
