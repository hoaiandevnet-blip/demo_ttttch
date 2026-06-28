BEGIN;

DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS inventory_sessions CASCADE;
DROP TABLE IF EXISTS handover_record_assets CASCADE;
DROP TABLE IF EXISTS handover_records CASCADE;
DROP TABLE IF EXISTS handover_recipients CASCADE;
DROP TABLE IF EXISTS asset_assignments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS asset_categories CASCADE;
DROP TABLE IF EXISTS staff_documents CASCADE;
DROP TABLE IF EXISTS staff_profiles CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS ranks CASCADE;
DROP TABLE IF EXISTS positions CASCADE;

CREATE TABLE positions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ranks (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit_type TEXT NOT NULL DEFAULT 'Cấp phòng',
  parent_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  id BIGSERIAL PRIMARY KEY,
  department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  rank_id BIGINT REFERENCES ranks(id) ON DELETE SET NULL,
  position_id BIGINT REFERENCES positions(id) ON DELETE SET NULL,
  team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  role_name TEXT NOT NULL DEFAULT 'Cán bộ nghiệp vụ',
  status TEXT NOT NULL DEFAULT 'Hoạt động' CHECK (status IN ('Hoạt động', 'Tạm khóa')),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE modules (
  id BIGSERIAL PRIMARY KEY,
  module_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  is_admin_only BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT REFERENCES modules(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_permissions (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE staff_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  badge_number TEXT,
  birth_date DATE,
  gender TEXT,
  ethnicity TEXT,
  citizen_id TEXT,
  citizen_issued_date DATE,
  permanent_address TEXT,
  current_address TEXT,
  joined_date DATE,
  education_level TEXT,
  school_name TEXT,
  major TEXT,
  graduation_year INTEGER,
  training_type TEXT,
  foreign_language TEXT,
  marital_status TEXT,
  email TEXT,
  note TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff_documents (
  id BIGSERIAL PRIMARY KEY,
  staff_profile_id BIGINT NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT,
  uploaded_at DATE,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asset_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assets (
  id BIGSERIAL PRIMARY KEY,
  asset_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id BIGINT REFERENCES asset_categories(id) ON DELETE SET NULL,
  received_date DATE,
  manager_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Đang sử dụng' CHECK (status IN ('Đang sử dụng', 'Bảo trì', 'Hư', 'Tạm dừng')),
  original_value NUMERIC(14, 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asset_assignments (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  assigned_to_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
  returned_at DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE handover_recipients (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  manager_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  badge_number TEXT,
  phone TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE handover_records (
  id BIGSERIAL PRIMARY KEY,
  recipient_id BIGINT NOT NULL REFERENCES handover_recipients(id) ON DELETE CASCADE,
  handed_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  handover_no TEXT,
  handover_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  file_name TEXT,
  file_type TEXT,
  file_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE handover_record_assets (
  record_id BIGINT NOT NULL REFERENCES handover_records(id) ON DELETE CASCADE,
  asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (record_id, asset_id)
);

CREATE TABLE inventory_sessions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Đang kiểm kê',
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory_items (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES inventory_sessions(id) ON DELETE CASCADE,
  asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  expected_status TEXT,
  actual_status TEXT,
  checked BOOLEAN NOT NULL DEFAULT false,
  checked_by TEXT,
  checked_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, asset_id)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_assets_category_id ON assets(category_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_manager_user_id ON assets(manager_user_id);
CREATE INDEX idx_assets_team_id ON assets(team_id);
CREATE INDEX idx_asset_assignments_asset ON asset_assignments(asset_id);
CREATE INDEX idx_asset_assignments_user ON asset_assignments(assigned_to_user_id);
CREATE INDEX idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX idx_inventory_sessions_date ON inventory_sessions(inventory_date DESC, id DESC);
CREATE INDEX idx_inventory_items_session ON inventory_items(session_id);

INSERT INTO positions (name) VALUES
  ('Cán bộ'),
  ('Đội trưởng'),
  ('Phó đội trưởng');

INSERT INTO ranks (name) VALUES
  ('Thiếu úy'),
  ('Trung úy'),
  ('Đại úy'),
  ('Thượng úy');

INSERT INTO departments (name, unit_type) VALUES
  ('Công an TP. Đồng Nai', 'Cấp phòng'),
  ('Phòng PV01', 'Cấp phòng'),
  ('Công an xã mẫu', 'Cấp xã');

INSERT INTO teams (department_id, name) VALUES
  ((SELECT id FROM departments WHERE name = 'Phòng PV01'), 'Đội trang bị'),
  ((SELECT id FROM departments WHERE name = 'Phòng PV01'), 'Đội tổng hợp'),
  ((SELECT id FROM departments WHERE name = 'Phòng PV01'), 'Phòng CNTT'),
  ((SELECT id FROM departments WHERE name = 'Phòng PV01'), 'Phòng tổng hợp'),
  ((SELECT id FROM departments WHERE name = 'Công an xã mẫu'), 'Trạm tổng hợp');

INSERT INTO users (username, password_hash, full_name, phone, rank_id, position_id, team_id, role_name, status, is_admin) VALUES
  ('admin', '123456', 'Admin', NULL, NULL, NULL, NULL, 'Quản trị viên', 'Hoạt động', true),
  ('nguyenvana', '123456', 'Nguyễn Văn A', '0912345678',
    (SELECT id FROM ranks WHERE name = 'Đại úy'),
    (SELECT id FROM positions WHERE name = 'Cán bộ'),
    (SELECT id FROM teams WHERE name = 'Đội trang bị'),
    'Cán bộ nghiệp vụ', 'Hoạt động', false),
  ('tranthib', '123456', 'Trần Thị B', '0987654321',
    (SELECT id FROM ranks WHERE name = 'Thượng úy'),
    (SELECT id FROM positions WHERE name = 'Đội trưởng'),
    (SELECT id FROM teams WHERE name = 'Phòng CNTT'),
    'Đội trưởng', 'Hoạt động', false),
  ('levanc', '123456', 'Lê Văn C', '0901122334',
    (SELECT id FROM ranks WHERE name = 'Trung úy'),
    (SELECT id FROM positions WHERE name = 'Phó đội trưởng'),
    (SELECT id FROM teams WHERE name = 'Đội tổng hợp'),
    'Cán bộ nghiệp vụ', 'Tạm khóa', false);

INSERT INTO modules (module_key, name, description, icon, visible, is_admin_only, is_custom) VALUES
  ('permissions', 'Hệ thống & Phân quyền', 'Quản trị tài khoản, nhóm người dùng và quyền chức năng', 'shield-check', true, true, false),
  ('staffDirectory', 'Quản lý cán bộ', 'Quản lý cán bộ theo đội, xem số hiệu, số điện thoại và hồ sơ chi tiết', 'users-round', true, true, false),
  ('catalogManager', 'Quản lý danh mục', 'Thêm, sửa, xóa chức vụ và chức hàm', 'list-plus', true, true, false),
  ('teamManager', 'Quản lý đơn vị', 'Tạo cấp phòng, cấp xã và quản lý các đội trực thuộc', 'building-2', true, true, false),
  ('moduleManager', 'Quản lý module', 'Thiết lập module được hiển thị cho tài khoản cán bộ', 'layout-dashboard', true, true, false),
  ('assetCategoryManager', 'Danh mục tài sản', 'Quản lý loại tài sản và theo dõi trạng thái thiết bị', 'boxes', true, true, false),
  ('reports', 'Báo cáo', 'Thống kê thiết bị và tình hình bàn giao theo đội', 'chart-column', true, true, false),
  ('activityLog', 'Log lịch sử', 'Theo dõi toàn bộ quá trình sử dụng và thay đổi dữ liệu của tài khoản', 'history', true, true, false),
  ('staff', 'Hồ sơ Cán bộ', 'Cho phép cán bộ xem và cập nhật hồ sơ cá nhân', 'id-card', true, false, false),
  ('assets', 'Quản lý Tài sản', 'Cho phép xem tài sản được bàn giao', 'package-check', true, false, false),
  ('settings', 'Cài đặt', 'Tùy biến chế độ hiển thị, màu nhấn và mật độ giao diện', 'settings', true, false, false);

INSERT INTO permissions (module_id, name) VALUES
  ((SELECT id FROM modules WHERE module_key = 'permissions'), 'Quản lý hệ thống'),
  ((SELECT id FROM modules WHERE module_key = 'staffDirectory'), 'Quản lý cán bộ'),
  ((SELECT id FROM modules WHERE module_key = 'catalogManager'), 'Quản lý danh mục'),
  ((SELECT id FROM modules WHERE module_key = 'teamManager'), 'Quản lý đơn vị'),
  ((SELECT id FROM modules WHERE module_key = 'moduleManager'), 'Quản lý module'),
  ((SELECT id FROM modules WHERE module_key = 'assetCategoryManager'), 'Danh mục tài sản'),
  ((SELECT id FROM modules WHERE module_key = 'staff'), 'Quản lý hồ sơ cán bộ'),
  ((SELECT id FROM modules WHERE module_key = 'assets'), 'Quản lý Tài sản'),
  ((SELECT id FROM modules WHERE module_key = 'permissions'), 'Quản lý phân quyền phần mềm'),
  ((SELECT id FROM modules WHERE module_key = 'reports'), 'Báo cáo'),
  ((SELECT id FROM modules WHERE module_key = 'activityLog'), 'Log lịch sử'),
  ((SELECT id FROM modules WHERE module_key = 'settings'), 'Cài đặt'),
  (NULL, 'Xuất dữ liệu');

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u
CROSS JOIN permissions p
WHERE u.username = 'admin';

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u
JOIN permissions p ON p.name IN ('Quản lý hồ sơ cán bộ', 'Quản lý tài sản', 'Xuất dữ liệu')
WHERE u.username = 'nguyenvana';

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u
JOIN permissions p ON p.name IN ('Quản lý hồ sơ cán bộ', 'Quản lý tài sản', 'Báo cáo thống kê')
WHERE u.username = 'tranthib';

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u
JOIN permissions p ON p.name IN ('Quản lý tài sản')
WHERE u.username = 'levanc';

INSERT INTO staff_profiles (
  user_id, badge_number, birth_date, gender, ethnicity, citizen_id, citizen_issued_date,
  permanent_address, current_address, joined_date, education_level, school_name,
  major, graduation_year, training_type, foreign_language, marital_status, email, note
) VALUES
  ((SELECT id FROM users WHERE username = 'nguyenvana'), 'CB001', '1992-03-12', 'Nam', 'Kinh', '001092000001', '2021-04-20',
   'Hà Nội', 'Hà Nội', '2014-08-15', 'Đại học', 'Học viện Kỹ thuật mật mã',
   'Công nghệ thông tin', 2014, 'Chính quy', 'Tiếng Anh B1', 'Đã kết hôn', 'nguyenvana@example.local', 'Cán bộ phụ trách thiết bị CNTT'),
  ((SELECT id FROM users WHERE username = 'tranthib'), 'CB002', '1990-11-08', 'Nữ', 'Kinh', '001090000002', '2020-05-12',
   'TP Hồ Chí Minh', 'TP Hồ Chí Minh', '2012-09-03', 'Đại học', 'Đại học An ninh nhân dân',
   'An toàn thông tin', 2012, 'Chính quy', 'Tiếng Anh B2', 'Độc thân', 'tranthib@example.local', 'Phụ trách điều phối đội'),
  ((SELECT id FROM users WHERE username = 'levanc'), 'CB003', '1995-07-17', 'Nam', 'Kinh', '001095000003', '2022-06-06',
   'Đà Nẵng', 'Đà Nẵng', '2018-10-10', 'Đại học', 'Học viện Cảnh sát nhân dân',
   'Quản lý hành chính', 2018, 'Chính quy', 'Tiếng Anh B1', 'Đã kết hôn', 'levanc@example.local', 'Tài khoản đang tạm khóa');

INSERT INTO staff_documents (staff_profile_id, document_name, document_type, uploaded_at, description) VALUES
  ((SELECT sp.id FROM staff_profiles sp JOIN users u ON u.id = sp.user_id WHERE u.username = 'nguyenvana'), 'Hồ sơ cán bộ', 'PDF scan', '2026-06-01', 'Hồ sơ lý lịch và văn bằng'),
  ((SELECT sp.id FROM staff_profiles sp JOIN users u ON u.id = sp.user_id WHERE u.username = 'tranthib'), 'Quyết định bổ nhiệm', 'PDF scan', '2026-05-20', 'Quyết định chức vụ đội trưởng'),
  ((SELECT sp.id FROM staff_profiles sp JOIN users u ON u.id = sp.user_id WHERE u.username = 'levanc'), 'Hồ sơ công tác', 'PDF scan', '2026-05-18', 'Hồ sơ cập nhật năm 2026');

INSERT INTO asset_categories (name) VALUES
  ('PC'),
  ('Màn hình'),
  ('Bàn phím'),
  ('Chuột'),
  ('Xe máy'),
  ('Flycam'),
  ('Di động'),
  ('Ô tô'),
  ('Máy chiếu');

INSERT INTO assets (asset_code, name, category_id, received_date, manager_user_id, team_id, status, original_value, note) VALUES
  ('TB001', 'Máy tính để bàn HP EliteDesk', (SELECT id FROM asset_categories WHERE name = 'PC'), '2026-05-14',
   (SELECT id FROM users WHERE username = 'nguyenvana'), (SELECT id FROM teams WHERE name = 'Đội trang bị'), 'Đang sử dụng', 18000000, 'Máy làm việc văn phòng'),
  ('TB002', 'Xe ô tô Ford Everest', (SELECT id FROM asset_categories WHERE name = 'Ô tô'), '2026-04-22',
   (SELECT id FROM users WHERE username = 'tranthib'), (SELECT id FROM teams WHERE name = 'Phòng CNTT'), 'Đang sử dụng', 980000000, 'Xe công tác'),
  ('TB003', 'Máy chiếu Sony', (SELECT id FROM asset_categories WHERE name = 'Máy chiếu'), '2026-03-09',
   NULL, (SELECT id FROM teams WHERE name = 'Phòng tổng hợp'), 'Bảo trì', 24000000, 'Chờ bảo trì'),
  ('TB004', 'Màn hình Dell 24 inch', (SELECT id FROM asset_categories WHERE name = 'Màn hình'), '2026-05-10',
   (SELECT id FROM users WHERE username = 'nguyenvana'), (SELECT id FROM teams WHERE name = 'Đội trang bị'), 'Đang sử dụng', 4200000, 'Màn hình làm việc'),
  ('TB005', 'Bàn phím Logitech K120', (SELECT id FROM asset_categories WHERE name = 'Bàn phím'), '2026-05-10',
   (SELECT id FROM users WHERE username = 'nguyenvana'), (SELECT id FROM teams WHERE name = 'Đội trang bị'), 'Đang sử dụng', 250000, 'Thiết bị ngoại vi'),
  ('TB006', 'Chuột Logitech M90', (SELECT id FROM asset_categories WHERE name = 'Chuột'), '2026-05-10',
   (SELECT id FROM users WHERE username = 'nguyenvana'), (SELECT id FROM teams WHERE name = 'Đội trang bị'), 'Đang sử dụng', 180000, 'Thiết bị ngoại vi'),
  ('TB007', 'Xe máy Honda Wave', (SELECT id FROM asset_categories WHERE name = 'Xe máy'), '2026-04-05',
   (SELECT id FROM users WHERE username = 'levanc'), (SELECT id FROM teams WHERE name = 'Đội tổng hợp'), 'Đang sử dụng', 22000000, 'Phương tiện cơ động'),
  ('TB008', 'Flycam DJI Mini', (SELECT id FROM asset_categories WHERE name = 'Flycam'), '2026-04-18',
   (SELECT id FROM users WHERE username = 'tranthib'), (SELECT id FROM teams WHERE name = 'Phòng CNTT'), 'Đang sử dụng', 15000000, 'Thiết bị hỗ trợ quan sát'),
  ('TB009', 'Điện thoại Samsung A55', (SELECT id FROM asset_categories WHERE name = 'Di động'), '2026-04-19',
   (SELECT id FROM users WHERE username = 'tranthib'), (SELECT id FROM teams WHERE name = 'Phòng CNTT'), 'Hư', 8500000, 'Vỡ màn hình');

INSERT INTO asset_assignments (asset_id, assigned_to_user_id, assigned_to_team_id, assigned_at, note)
SELECT a.id, a.manager_user_id, a.team_id, COALESCE(a.received_date, CURRENT_DATE), 'Dữ liệu bàn giao mẫu'
FROM assets a
WHERE a.manager_user_id IS NOT NULL OR a.team_id IS NOT NULL;

INSERT INTO handover_recipients (team_id, manager_user_id, full_name, badge_number, phone, note) VALUES
  ((SELECT id FROM teams WHERE name = 'Đội trang bị'), (SELECT id FROM users WHERE username = 'nguyenvana'), 'Phạm Quốc Dũng', 'CB004', '0904455667', 'Bàn giao phục vụ công tác thường trực'),
  ((SELECT id FROM teams WHERE name = 'Đội tổng hợp'), (SELECT id FROM users WHERE username = 'levanc'), 'Hoàng Văn Minh', 'CB005', '0917788990', 'Bàn giao phương tiện cơ động');

INSERT INTO handover_records (recipient_id, handed_by_user_id, handover_no, handover_date, note) VALUES
  ((SELECT id FROM handover_recipients WHERE full_name = 'Phạm Quốc Dũng'), (SELECT id FROM users WHERE username = 'nguyenvana'), 'BBBG-001/2026', '2026-06-02', 'Biên bản bàn giao mẫu'),
  ((SELECT id FROM handover_recipients WHERE full_name = 'Hoàng Văn Minh'), (SELECT id FROM users WHERE username = 'levanc'), 'BBBG-002/2026', '2026-06-03', 'Biên bản bàn giao mẫu');

INSERT INTO handover_record_assets (record_id, asset_id)
SELECT (SELECT id FROM handover_records WHERE handover_no = 'BBBG-001/2026'), id
FROM assets
WHERE asset_code IN ('TB001', 'TB004');

INSERT INTO handover_record_assets (record_id, asset_id)
SELECT (SELECT id FROM handover_records WHERE handover_no = 'BBBG-002/2026'), id
FROM assets
WHERE asset_code IN ('TB007');

COMMIT;
