BEGIN;

CREATE TABLE IF NOT EXISTS positions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ranks (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit_type TEXT NOT NULL DEFAULT 'Cấp phòng',
  parent_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS modules (
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

CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT REFERENCES modules(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_permissions (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE IF NOT EXISTS staff_profiles (
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

CREATE TABLE IF NOT EXISTS staff_documents (
  id BIGSERIAL PRIMARY KEY,
  staff_profile_id BIGINT NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT,
  uploaded_at DATE,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asset_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assets (
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

CREATE TABLE IF NOT EXISTS asset_assignments (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  assigned_to_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
  returned_at DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS handover_recipients (
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

CREATE TABLE IF NOT EXISTS handover_records (
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

CREATE TABLE IF NOT EXISTS handover_record_assets (
  record_id BIGINT NOT NULL REFERENCES handover_records(id) ON DELETE CASCADE,
  asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (record_id, asset_id)
);

CREATE TABLE IF NOT EXISTS inventory_sessions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Đang kiểm kê',
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_items (
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

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_username TEXT NOT NULL DEFAULT 'system',
  action TEXT NOT NULL,
  module_key TEXT,
  module_name TEXT,
  detail TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_assets_category_id ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_manager_user_id ON assets(manager_user_id);
CREATE INDEX IF NOT EXISTS idx_assets_team_id ON assets(team_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_asset ON asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_user ON asset_assignments(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_handover_recipients_team ON handover_recipients(team_id);
CREATE INDEX IF NOT EXISTS idx_handover_records_recipient ON handover_records(recipient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sessions_date ON inventory_sessions(inventory_date DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_items_session ON inventory_items(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON activity_logs(actor_username);

INSERT INTO positions (name) VALUES
  ('Cán bộ'),
  ('Đội trưởng'),
  ('Phó đội trưởng')
ON CONFLICT (name) DO NOTHING;

INSERT INTO ranks (name) VALUES
  ('Thiếu úy'),
  ('Trung úy'),
  ('Đại úy'),
  ('Thượng úy'),
  ('Thiếu tá'),
  ('Trung tá'),
  ('Đại tá')
ON CONFLICT (name) DO NOTHING;

INSERT INTO departments (name, unit_type) VALUES
  ('Công an TP. Đồng Nai', 'Cấp phòng'),
  ('Phòng PV01', 'Cấp phòng')
ON CONFLICT (name) DO UPDATE
SET unit_type = EXCLUDED.unit_type,
    updated_at = now();

INSERT INTO asset_categories (name) VALUES
  ('PC'),
  ('Màn hình'),
  ('Bàn phím'),
  ('Chuột'),
  ('Xe máy'),
  ('Flycam'),
  ('Di động'),
  ('Ô tô'),
  ('Máy chiếu')
ON CONFLICT (name) DO NOTHING;

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
  ('settings', 'Cài đặt', 'Tùy biến chế độ hiển thị, màu nhấn và mật độ giao diện', 'settings', true, false, false)
ON CONFLICT (module_key) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    visible = EXCLUDED.visible,
    is_admin_only = EXCLUDED.is_admin_only,
    is_custom = EXCLUDED.is_custom;

INSERT INTO permissions (module_id, name)
SELECT m.id, v.permission_name
FROM (
  VALUES
    ('permissions', 'Quản lý hệ thống'),
    ('permissions', 'Quản lý phân quyền phần mềm'),
    ('staffDirectory', 'Quản lý cán bộ'),
    ('catalogManager', 'Quản lý danh mục'),
    ('teamManager', 'Quản lý đơn vị'),
    ('moduleManager', 'Quản lý module'),
    ('assetCategoryManager', 'Danh mục tài sản'),
    ('staff', 'Quản lý hồ sơ cán bộ'),
    ('assets', 'Quản lý Tài sản'),
    ('reports', 'Báo cáo'),
    ('activityLog', 'Log lịch sử'),
    ('settings', 'Cài đặt')
) AS v(module_key, permission_name)
JOIN modules m ON m.module_key = v.module_key
ON CONFLICT (name) DO UPDATE
SET module_id = EXCLUDED.module_id;

INSERT INTO users (username, password_hash, full_name, phone, rank_id, position_id, team_id, role_name, status, is_admin, is_deleted)
VALUES (
  'admin',
  'scrypt$0123456789abcdef0123456789abcdef$050112650e95a974eceb74df3d7d517aebcdd21a5a341780b2f24a83256ff389842a670a26386c821b4f8d65553ec1474ca4651459def956b2310081b560ef8a',
  'Admin',
  NULL,
  NULL,
  NULL,
  NULL,
  'Quản trị viên',
  'Hoạt động',
  true,
  false
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    full_name = 'Admin',
    phone = NULL,
    rank_id = NULL,
    position_id = NULL,
    team_id = NULL,
    role_name = 'Quản trị viên',
    status = 'Hoạt động',
    is_admin = true,
    is_deleted = false,
    updated_at = now();

INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u
CROSS JOIN permissions p
WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

COMMIT;
