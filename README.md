# Demo phần mềm TTTTCH

Bản web app mô phỏng theo video demo: hệ thống quản trị tài khoản, phân quyền, hồ sơ cán bộ và quản lý tài sản.

## Cách chạy
Chạy server Node.js:

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

File `ttttch_schema_seed.sql` chỉ dùng cho môi trường demo/test vì có dữ liệu mẫu.

## Cấu trúc
- `index.html`: giao diện chính
- `assets/css/style.css`: style/responsive
- `assets/js/app.js`: dữ liệu mẫu và chức năng tương tác
- `server/index.js`: API nghiệp vụ
- `server/db.js`: cấu hình kết nối PostgreSQL
- `ttttch_production_bootstrap.sql`: dựng database mới cho môi trường thật
- `ttttch_schema_seed.sql`: dựng database demo có dữ liệu mẫu

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
