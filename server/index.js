import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { pool, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const app = express();
const port = Number(process.env.PORT || 3000);
const handoverFileMaxBytes = 6 * 1024 * 1024;
const avatarFileMaxBytes = 2 * 1024 * 1024;
const allowedHandoverFiles = new Map([
  ['.doc', {
    types: ['application/msword', 'application/octet-stream'],
    signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'))
  }],
  ['.docx', {
    types: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
    signature: (buffer) => buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b
  }],
  ['.png', {
    types: ['image/png'],
    signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
  }],
  ['.jpg', {
    types: ['image/jpeg'],
    signature: (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }],
  ['.jpeg', {
    types: ['image/jpeg'],
    signature: (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }],
  ['.webp', {
    types: ['image/webp'],
    signature: (buffer) => buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  }]
]);
const allowedAvatarTypes = new Map([
  ['image/png', allowedHandoverFiles.get('.png').signature],
  ['image/jpeg', allowedHandoverFiles.get('.jpg').signature],
  ['image/webp', allowedHandoverFiles.get('.webp').signature]
]);

app.use(express.json({ limit: '10mb' }));
app.use(express.static(appRoot));

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function toDbDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const vnDate = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (vnDate) return `${vnDate[3]}-${vnDate[2]}-${vnDate[1]}`;
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  return null;
}

function toNullableText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function normalizeUsername(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');
}

function isValidUsername(value) {
  return /^[a-z0-9._-]{3,32}$/.test(String(value ?? ''));
}

function sendUsernameError(res) {
  res.status(400).json({ error: 'Tên đăng nhập chỉ dùng chữ thường không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang, dài 3-32 ký tự' });
}

function validateHandoverFile({ fileName, fileType, fileData }) {
  const name = String(fileName || '').trim();
  const type = String(fileType || '').split(';')[0].trim().toLowerCase();
  const dataUrl = String(fileData || '').trim();
  if (!name && !dataUrl) return { fileName: null, fileType: null, fileData: null };
  if (!name || !dataUrl) {
    return { error: 'Thông tin file biên bản không đầy đủ' };
  }
  if (name.length > 180 || /[\\/:\0]/.test(name)) {
    return { error: 'Tên file biên bản không hợp lệ' };
  }
  const ext = path.extname(name).toLowerCase();
  const policy = allowedHandoverFiles.get(ext);
  if (!policy) {
    return { error: 'File biên bản chỉ hỗ trợ .doc, .docx, .png, .jpg, .jpeg hoặc .webp' };
  }
  const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    return { error: 'Dữ liệu file biên bản không đúng định dạng base64' };
  }
  const dataType = match[1].trim().toLowerCase();
  const base64 = match[2].replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length % 4 !== 0) {
    return { error: 'Dữ liệu file biên bản không hợp lệ' };
  }
  if (!policy.types.includes(dataType) || (type && !policy.types.includes(type))) {
    return { error: 'Loại file biên bản không khớp danh sách cho phép' };
  }
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length || buffer.length > handoverFileMaxBytes) {
    return { error: 'File biên bản vượt quá dung lượng cho phép 6 MB', status: 413 };
  }
  if (!policy.signature(buffer)) {
    return { error: 'Nội dung file biên bản không đúng định dạng khai báo' };
  }
  return {
    fileName: name,
    fileType: dataType,
    fileData: `data:${dataType};base64,${base64}`
  };
}

function validateAvatarPhoto(photo) {
  const dataUrl = String(photo || '').trim();
  if (!dataUrl) return { photo: null };
  const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    return { error: 'Ảnh hồ sơ không đúng định dạng base64' };
  }
  const dataType = match[1].trim().toLowerCase();
  const signature = allowedAvatarTypes.get(dataType);
  if (!signature) {
    return { error: 'Ảnh hồ sơ chỉ hỗ trợ .png, .jpg, .jpeg hoặc .webp' };
  }
  const base64 = match[2].replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length % 4 !== 0) {
    return { error: 'Dữ liệu ảnh hồ sơ không hợp lệ' };
  }
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length || buffer.length > avatarFileMaxBytes) {
    return { error: 'Ảnh hồ sơ vượt quá dung lượng cho phép 2 MB', status: 413 };
  }
  if (!signature(buffer)) {
    return { error: 'Nội dung ảnh hồ sơ không đúng định dạng khai báo' };
  }
  return { photo: `data:${dataType};base64,${base64}` };
}

function getActor(req) {
  return String(req.get('x-actor') || req.body?.actor || req.query?.actor || 'system').trim() || 'system';
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password || ''), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function isHashedPassword(value) {
  return /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/i.test(String(value || ''));
}

function verifyPassword(password, stored) {
  const storedText = String(stored || '');
  if (isHashedPassword(storedText)) {
    const [, salt, expectedHex] = storedText.split('$');
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = scryptSync(String(password || ''), salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
  return storedText === String(password || '');
}

async function logActivity(req, {
  action,
  moduleKey = null,
  moduleName = null,
  detail = '',
  metadata = {}
}, client = pool) {
  if (!action) return;
  const actor = getActor(req);
  await client.query(`
    insert into activity_logs (actor_username, action, module_key, module_name, detail, metadata, ip_address, user_agent)
    values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
  `, [
    actor,
    action,
    moduleKey,
    moduleName,
    detail,
    JSON.stringify(metadata || {}),
    getClientIp(req),
    req.get('user-agent') || ''
  ]);
}

async function upgradePlaintextPasswords(client = pool) {
  const result = await client.query('select id, password_hash from users');
  for (const row of result.rows) {
    if (isHashedPassword(row.password_hash)) continue;
    await client.query(
      'update users set password_hash = $2, updated_at = now() where id = $1',
      [row.id, hashPassword(row.password_hash)]
    );
  }
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

async function syncModulePermissions(client = pool) {
  const modules = await client.query(`
    select id, module_key, name
    from modules
    where module_key not in ('permissions', 'staff')
    order by id
  `);
  for (const module of modules.rows) {
    const linked = await client.query(
      'select id, name from permissions where module_id = $1 order by id',
      [module.id]
    );
    let permissionId = linked.rows[0]?.id;
    if (!permissionId) {
      const existingName = await client.query(
        'select id from permissions where name = $1 limit 1',
        [module.name]
      );
      if (existingName.rows[0]?.id) {
        permissionId = existingName.rows[0].id;
        await client.query('update permissions set module_id = $2 where id = $1', [permissionId, module.id]);
      } else {
        const inserted = await client.query(
          'insert into permissions (module_id, name) values ($1, $2) returning id',
          [module.id, module.name]
        );
        permissionId = inserted.rows[0].id;
      }
    }
    for (const duplicate of linked.rows.slice(1)) {
      await client.query(`
        insert into user_permissions (user_id, permission_id)
        select user_id, $1
        from user_permissions
        where permission_id = $2
        on conflict do nothing
      `, [permissionId, duplicate.id]);
      await client.query('delete from permissions where id = $1', [duplicate.id]);
    }
    const nameConflict = await client.query(
      'select id from permissions where name = $1 and id <> $2 limit 1',
      [module.name, permissionId]
    );
    if (!nameConflict.rows.length) {
      await client.query(
        'update permissions set name = $2, module_id = $3 where id = $1',
        [permissionId, module.name, module.id]
      );
    }
  }
}

async function ensureSchema() {
  await pool.query(`
    create table if not exists activity_logs (
      id bigserial primary key,
      actor_username text not null default 'system',
      action text not null,
      module_key text,
      module_name text,
      detail text,
      metadata jsonb not null default '{}'::jsonb,
      ip_address text,
      user_agent text,
      created_at timestamptz not null default now()
    )
  `);
  await pool.query('create index if not exists idx_activity_logs_created_at on activity_logs (created_at desc)');
  await pool.query('create index if not exists idx_activity_logs_actor on activity_logs (actor_username)');
  await pool.query(`
    create table if not exists inventory_sessions (
      id bigserial primary key,
      name text not null,
      inventory_date date not null default current_date,
      status text not null default 'Đang kiểm kê',
      note text,
      created_by text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await pool.query(`
    create table if not exists inventory_items (
      id bigserial primary key,
      session_id bigint not null references inventory_sessions(id) on delete cascade,
      asset_id bigint not null references assets(id) on delete cascade,
      expected_status text,
      actual_status text,
      checked boolean not null default false,
      checked_by text,
      checked_at timestamptz,
      note text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique(session_id, asset_id)
    )
  `);
  await pool.query('create index if not exists idx_inventory_sessions_date on inventory_sessions (inventory_date desc, id desc)');
  await pool.query('create index if not exists idx_inventory_items_session on inventory_items (session_id)');
  await pool.query('alter table if exists staff_profiles add column if not exists badge_number text');
  await pool.query(`
    create table if not exists asset_assignments (
      id bigserial primary key,
      asset_id bigint not null references assets(id) on delete cascade,
      assigned_to_user_id bigint references users(id) on delete set null,
      assigned_to_team_id bigint references teams(id) on delete set null,
      assigned_at date not null default current_date,
      returned_at date,
      note text,
      created_at timestamptz not null default now()
    )
  `);
  await pool.query('create index if not exists idx_asset_assignments_asset on asset_assignments (asset_id)');
  await pool.query('create index if not exists idx_asset_assignments_user on asset_assignments (assigned_to_user_id)');
  await pool.query(`
    create table if not exists handover_recipients (
      id bigserial primary key,
      team_id bigint references teams(id) on delete set null,
      manager_user_id bigint references users(id) on delete set null,
      full_name text not null,
      badge_number text,
      phone text,
      note text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await pool.query(`
    create table if not exists handover_records (
      id bigserial primary key,
      recipient_id bigint not null references handover_recipients(id) on delete cascade,
      handed_by_user_id bigint references users(id) on delete set null,
      handover_no text,
      handover_date date not null default current_date,
      note text,
      file_name text,
      file_type text,
      file_data text,
      created_at timestamptz not null default now()
    )
  `);
  await pool.query('alter table handover_records add column if not exists file_name text');
  await pool.query('alter table handover_records add column if not exists file_type text');
  await pool.query('alter table handover_records add column if not exists file_data text');
  await pool.query(`
    create table if not exists handover_record_assets (
      record_id bigint not null references handover_records(id) on delete cascade,
      asset_id bigint not null references assets(id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (record_id, asset_id)
    )
  `);
  await pool.query('create index if not exists idx_handover_recipients_team on handover_recipients (team_id)');
  await pool.query('create index if not exists idx_handover_records_recipient on handover_records (recipient_id)');
  await pool.query(`
    alter table departments
    add column if not exists unit_type text not null default 'Cấp phòng'
  `);
  await pool.query(`
    alter table departments
    add column if not exists parent_id bigint references departments(id) on delete set null
  `);
  await pool.query(`
    alter table departments
    add column if not exists updated_at timestamptz not null default now()
  `);
  await pool.query(`
    update departments
    set unit_type = 'Cấp phòng'
    where unit_type is null or unit_type = ''
  `);
  await pool.query(`
    alter table users
    add column if not exists is_deleted boolean not null default false
  `);
  await pool.query(`
    update users
    set is_deleted = false
    where is_deleted is null
  `);
  await pool.query(`
    update modules
    set
      name = 'Quản lý cán bộ',
      description = 'Quản lý cán bộ theo đội, xem số hiệu, số điện thoại và hồ sơ chi tiết'
    where module_key = 'staffDirectory'
  `);
  await pool.query(`
    update modules
    set
      module_key = 'teamManager',
      name = 'Quản lý đơn vị',
      description = 'Tạo cấp phòng, cấp xã và quản lý các đội trực thuộc',
      icon = 'building-2',
      visible = true,
      is_admin_only = true,
      is_custom = false
    where module_key = 'quan-ly-doi'
      and not exists (select 1 from modules where module_key = 'teamManager')
  `);
  await pool.query(`
    insert into modules (module_key, name, description, icon, visible, is_admin_only, is_custom)
    values ('teamManager', 'Quản lý đơn vị', 'Tạo cấp phòng, cấp xã và quản lý các đội trực thuộc', 'building-2', true, true, false)
    on conflict (module_key) do update
    set
      name = excluded.name,
      description = excluded.description,
      icon = excluded.icon,
      is_admin_only = excluded.is_admin_only
  `);
  await pool.query(`
    insert into modules (module_key, name, description, icon, visible, is_admin_only, is_custom)
    values ('settings', 'Cài đặt', 'Tùy biến chế độ hiển thị, màu nhấn và mật độ giao diện', 'settings', true, false, false)
    on conflict (module_key) do update
    set
      name = excluded.name,
      description = excluded.description,
      icon = excluded.icon,
      visible = excluded.visible,
      is_admin_only = excluded.is_admin_only,
      is_custom = excluded.is_custom
  `);
  await pool.query(`
    insert into modules (module_key, name, description, icon, visible, is_admin_only, is_custom)
    values ('activityLog', 'Log lịch sử', 'Theo dõi toàn bộ quá trình sử dụng và thay đổi dữ liệu của tài khoản', 'history', true, true, false)
    on conflict (module_key) do update
    set
      name = excluded.name,
      description = excluded.description,
      icon = excluded.icon,
      visible = excluded.visible,
      is_admin_only = excluded.is_admin_only,
      is_custom = excluded.is_custom
  `);
  await pool.query(`
    update permissions
    set name = 'Quản lý đơn vị'
    where name in ('Quản lý quản lý đội', 'Quản lý đội')
      and not exists (select 1 from permissions where name = 'Quản lý đơn vị')
  `);
  await pool.query(`
    insert into permissions (module_id, name)
    select id, 'Quản lý đơn vị'
    from modules
    where module_key = 'teamManager'
    on conflict (name) do update
    set module_id = excluded.module_id
  `);
  await pool.query(`
    insert into user_permissions (user_id, permission_id)
    select up.user_id, target.id
    from user_permissions up
    join permissions old_perm on old_perm.id = up.permission_id
    cross join permissions target
    where old_perm.name in ('Quản lý quản lý đội', 'Quản lý đội')
      and target.name = 'Quản lý đơn vị'
    on conflict do nothing
  `);
  await pool.query(`
    delete from permissions
    where name in ('Quản lý quản lý đội', 'Quản lý đội')
      and exists (select 1 from permissions where name = 'Quản lý đơn vị')
  `);
  await pool.query(`
    insert into permissions (module_id, name)
    select m.id, v.permission_name
    from (
      values
        ('staffDirectory', 'Quản lý cán bộ'),
        ('catalogManager', 'Quản lý danh mục'),
        ('moduleManager', 'Quản lý module'),
        ('assetCategoryManager', 'Danh mục tài sản'),
        ('reports', 'Báo cáo'),
        ('settings', 'Cài đặt'),
        ('activityLog', 'Log lịch sử'),
        ('assets', 'Quản lý Tài sản')
    ) as v(module_key, permission_name)
    join modules m on m.module_key = v.module_key
    on conflict (name) do update
    set module_id = excluded.module_id
  `);
  await syncModulePermissions();
  await upgradePlaintextPasswords();
}

app.get('/api/health', asyncHandler(async (_req, res) => {
  const [row] = await query('select now() as db_time');
  res.json({ ok: true, dbTime: row.db_time });
}));

app.get('/api/activity-logs', asyncHandler(async (req, res) => {
  if (getActor(req) !== 'admin') {
    res.status(403).json({ error: 'Chỉ Admin được xem log lịch sử' });
    return;
  }
  const {
    username = '',
    moduleKey = '',
    action = '',
    q = '',
    dateFrom = '',
    dateTo = '',
    limit = '300'
  } = req.query;
  const where = [];
  const params = [];
  const add = (sql, value) => {
    params.push(value);
    where.push(sql.replace('?', `$${params.length}`));
  };
  if (username) add('actor_username = ?', username);
  if (moduleKey) add('module_key = ?', moduleKey);
  if (action) add('action = ?', action);
  if (dateFrom) add('created_at >= ?::date', dateFrom);
  if (dateTo) add('created_at < (?::date + interval \'1 day\')', dateTo);
  if (q) {
    params.push(`%${q}%`);
    where.push(`(actor_username ilike $${params.length} or action ilike $${params.length} or coalesce(module_name, '') ilike $${params.length} or coalesce(detail, '') ilike $${params.length})`);
  }
  const maxRows = Math.min(Math.max(Number(limit) || 300, 1), 2000);
  params.push(maxRows);
  const rows = await query(`
    select id, actor_username, action, module_key, module_name, detail, metadata, ip_address, user_agent, created_at
    from activity_logs
    ${where.length ? `where ${where.join(' and ')}` : ''}
    order by created_at desc, id desc
    limit $${params.length}
  `, params);
  res.json(rows);
}));

app.post('/api/activity-logs', asyncHandler(async (req, res) => {
  await logActivity(req, {
    action: String(req.body?.action || '').trim(),
    moduleKey: req.body?.moduleKey || null,
    moduleName: req.body?.moduleName || null,
    detail: req.body?.detail || '',
    metadata: req.body?.metadata || {}
  });
  res.status(201).json({ ok: true });
}));

app.get('/api/activity-logs/export', asyncHandler(async (req, res) => {
  if (getActor(req) !== 'admin') {
    res.status(403).send('Chỉ Admin được xuất log lịch sử');
    return;
  }
  const rows = await query(`
    select actor_username, action, coalesce(module_name, module_key, '') as module_name, detail, created_at, ip_address
    from activity_logs
    order by created_at desc, id desc
    limit 5000
  `);
  const header = ['Thời gian', 'Tài khoản', 'Hành động', 'Module', 'Chi tiết', 'IP'];
  const lines = [
    header.map(csvEscape).join(','),
    ...rows.map((row) => [
      new Date(row.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      row.actor_username,
      row.action,
      row.module_name,
      row.detail,
      row.ip_address
    ].map(csvEscape).join(','))
  ];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="log-lich-su-ttttch.csv"');
  res.send(`\uFEFF${lines.join('\n')}`);
}));

app.get('/api/accounts', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      u.id,
      u.username,
      u.full_name,
      u.phone,
      coalesce(r.name, '') as rank,
      coalesce(p.name, '') as position,
      coalesce(t.name, '') as team,
      u.role_name,
      u.status,
      u.is_admin,
      u.is_deleted
    from users u
    left join ranks r on r.id = u.rank_id
    left join positions p on p.id = u.position_id
    left join teams t on t.id = u.team_id
    where u.is_deleted = false
    order by u.is_admin desc, u.id
  `);
  res.json(rows);
}));

app.get('/api/accounts/check-username', asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.query?.username);
  const currentUsername = normalizeUsername(req.query?.currentUsername);
  if (!username) {
    res.json({ ok: true, username, available: false, reason: 'Vui lòng nhập tên đăng nhập' });
    return;
  }
  if (!isValidUsername(username)) {
    res.json({
      ok: true,
      username,
      available: false,
      reason: 'Tên đăng nhập chỉ dùng chữ thường không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang, dài 3-32 ký tự'
    });
    return;
  }
  const rows = await query('select username, is_deleted from users where username = $1 limit 1', [username]);
  if (!rows.length || (currentUsername && rows[0].username === currentUsername)) {
    res.json({ ok: true, username, available: true });
    return;
  }
  res.json({
    ok: true,
    username,
    available: false,
    reason: rows[0].is_deleted
      ? 'Tên đăng nhập đã tồn tại trong dữ liệu đã xóa mềm'
      : 'Tên đăng nhập đã tồn tại'
  });
}));

app.post('/api/login', asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password || '');
  if (!username || !password) {
    res.status(400).json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const result = await client.query(`
      select
        u.id,
        u.username,
        u.password_hash,
        u.full_name,
        u.phone,
        coalesce(r.name, '') as rank,
        coalesce(p.name, '') as position,
        coalesce(t.name, '') as team,
        u.role_name,
        u.status,
        u.is_admin
      from users u
      left join ranks r on r.id = u.rank_id
      left join positions p on p.id = u.position_id
      left join teams t on t.id = u.team_id
      where u.username = $1 and u.is_deleted = false
      limit 1
    `, [username]);
    const user = result.rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      await client.query('rollback');
      res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
      return;
    }
    if (user.status !== 'Hoạt động') {
      await client.query('rollback');
      res.status(403).json({ error: 'Tài khoản đang bị tạm khóa' });
      return;
    }
    if (!isHashedPassword(user.password_hash)) {
      await client.query('update users set password_hash = $2, updated_at = now() where id = $1', [user.id, hashPassword(password)]);
    }
    await logActivity(req, {
      action: 'Đăng nhập',
      moduleKey: 'login',
      moduleName: 'Đăng nhập hệ thống',
      detail: `Đăng nhập tài khoản ${username}`,
      metadata: { username }
    }, client);
    await client.query('commit');
    delete user.password_hash;
    res.json({ ok: true, account: user });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

async function findCatalogId(client, table, name) {
  if (!name) return null;
  const result = await client.query(`select id from ${table} where name = $1`, [name]);
  return result.rows[0]?.id || null;
}

async function ensureNamedId(client, table, name) {
  const cleanName = String(name || '').trim();
  if (!cleanName) return null;
  const existing = await client.query(`select id from ${table} where name = $1`, [cleanName]);
  if (existing.rows[0]?.id) return existing.rows[0].id;
  const inserted = await client.query(
    `insert into ${table} (name) values ($1) on conflict (name) do update set name = excluded.name returning id`,
    [cleanName]
  );
  return inserted.rows[0]?.id || null;
}

async function resolveDepartmentId(client, { departmentId, departmentName, unitType } = {}) {
  const numericDepartmentId = Number(departmentId) || null;
  if (numericDepartmentId) {
    const existing = await client.query('select id from departments where id = $1', [numericDepartmentId]);
    if (existing.rows[0]?.id) return existing.rows[0].id;
  }
  const cleanDepartmentName = String(departmentName || '').trim();
  if (!cleanDepartmentName) return null;
  const normalizedUnitType = ['Cấp phòng', 'Cấp xã'].includes(unitType) ? unitType : 'Cấp phòng';
  const result = await client.query(`
    insert into departments (name, unit_type)
    values ($1, $2)
    on conflict (name) do update set unit_type = excluded.unit_type, updated_at = now()
    returning id
  `, [cleanDepartmentName, normalizedUnitType]);
  return result.rows[0]?.id || null;
}

async function resolveTeamIdForAccount(client, body = {}) {
  const teamName = String(body.team || '').trim();
  if (!teamName) return null;
  const departmentId = await resolveDepartmentId(client, body);
  const existing = await client.query('select id, department_id from teams where name = $1', [teamName]);
  if (existing.rows[0]?.id) {
    if (departmentId && !existing.rows[0].department_id) {
      await client.query('update teams set department_id = $2 where id = $1', [existing.rows[0].id, departmentId]);
    }
    return existing.rows[0].id;
  }
  const inserted = await client.query(`
    insert into teams (department_id, name)
    values (coalesce($2, (select id from departments order by id limit 1)), $1)
    returning id
  `, [teamName, departmentId]);
  return inserted.rows[0]?.id || null;
}

async function findUserIdByName(client, value) {
  const cleanValue = String(value || '').trim();
  if (!cleanValue) return null;
  const result = await client.query(
    `select id from users where is_deleted = false and is_admin = false and (full_name = $1 or username = $1) limit 1`,
    [cleanValue]
  );
  return result.rows[0]?.id || null;
}

async function findUserIdByUsername(client, username) {
  const cleanUsername = String(username || '').trim();
  if (!cleanUsername) return null;
  const result = await client.query('select id from users where username = $1 and is_deleted = false limit 1', [cleanUsername]);
  return result.rows[0]?.id || null;
}

async function getActorAccount(client, req) {
  const actor = getActor(req);
  const result = await client.query(`
    select u.id, u.username, u.is_admin, u.team_id, coalesce(t.name, '') as team
    from users u
    left join teams t on t.id = u.team_id
    where u.username = $1 and u.is_deleted = false
    limit 1
  `, [actor]);
  return result.rows[0] || null;
}

function normalizeAssetDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const vn = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (vn) return `${vn[3]}-${vn[2]}-${vn[1]}`;
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[1]}-${iso[2]}-${iso[3]}` : null;
}

function normalizeAssetStatusValue(value) {
  const text = String(value || '').trim();
  return ['Đang sử dụng', 'Bảo trì', 'Hư', 'Tạm dừng'].includes(text) ? text : 'Đang sử dụng';
}

async function buildAssetPayload(client, body) {
  const assetCode = String(body.id || body.assetCode || body.asset_code || '').trim();
  const name = String(body.name || '').trim();
  if (!assetCode || !name) {
    return { error: 'Thiếu mã tài sản hoặc tên tài sản' };
  }
  return {
    assetCode,
    name,
    categoryId: await ensureNamedId(client, 'asset_categories', body.type || body.category),
    receivedDate: normalizeAssetDate(body.date || body.receivedDate || body.received_date),
    managerUserId: await findUserIdByName(client, body.owner || body.manager),
    teamId: await ensureNamedId(client, 'teams', body.unit || body.team),
    status: normalizeAssetStatusValue(body.status),
    originalValue: body.value || body.originalValue || body.original_value || null,
    note: body.note || null
  };
}

app.post('/api/accounts', asyncHandler(async (req, res) => {
  const {
    username,
    password,
    fullname,
    phone = '',
    badgeNumber = '',
    rank = '',
    position = '',
    team = '',
    unitType = '',
    departmentId = null,
    departmentName = '',
    status = 'Hoạt động'
  } = req.body;

  if (!username || !password || !fullname) {
    res.status(400).json({ error: 'Thiếu tên đăng nhập, mật khẩu hoặc họ tên' });
    return;
  }
  const normalizedUsername = normalizeUsername(username);
  if (!isValidUsername(normalizedUsername)) {
    sendUsernameError(res);
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('begin');
    const rankId = await findCatalogId(client, 'ranks', rank);
    const positionId = await findCatalogId(client, 'positions', position);
    const teamId = await resolveTeamIdForAccount(client, { team, unitType, departmentId, departmentName });
    const inserted = await client.query(`
      insert into users (username, password_hash, full_name, phone, rank_id, position_id, team_id, role_name, status, is_admin)
      values ($1, $2, $3, $4, $5, $6, $7, 'Cán bộ nghiệp vụ', $8, false)
      returning id
    `, [
      normalizedUsername,
      hashPassword(password),
      fullname.trim(),
      phone || null,
      rankId,
      positionId,
      teamId,
      status === 'Tạm khóa' ? 'Tạm khóa' : 'Hoạt động'
    ]);
    await client.query(`
      insert into staff_profiles (user_id, badge_number)
      values ($1, $2)
      on conflict (user_id) do nothing
    `, [inserted.rows[0].id, toNullableText(badgeNumber)]);
    await logActivity(req, {
      action: 'Tạo tài khoản',
      moduleKey: 'permissions',
      moduleName: 'Hệ thống & Phân quyền',
      detail: `Tạo tài khoản ${normalizedUsername}`,
      metadata: { username: normalizedUsername, fullname: fullname.trim(), team, unitType, departmentId, departmentName, rank, position }
    }, client);
    await client.query('commit');
    res.status(201).json({ ok: true, id: inserted.rows[0].id });
  } catch (error) {
    await client.query('rollback');
    if (error.code === '23505') {
      res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
}));

app.put('/api/accounts/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  const {
    username: requestedUsername = username,
    password,
    fullname,
    phone = '',
    badgeNumber = '',
    rank = '',
    position = '',
    team = '',
    unitType = '',
    departmentId = null,
    departmentName = '',
    status = 'Hoạt động'
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('begin');
    const current = await client.query('select id, is_admin, password_hash from users where username = $1 and is_deleted = false', [username]);
    if (!current.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy tài khoản' });
      return;
    }
    const user = current.rows[0];
    const nextUsername = user.is_admin ? username : normalizeUsername(requestedUsername);
    if (!user.is_admin && !isValidUsername(nextUsername)) {
      await client.query('rollback');
      sendUsernameError(res);
      return;
    }
    const rankId = user.is_admin ? null : await findCatalogId(client, 'ranks', rank);
    const positionId = user.is_admin ? null : await findCatalogId(client, 'positions', position);
    const teamId = user.is_admin ? null : await resolveTeamIdForAccount(client, { team, unitType, departmentId, departmentName });
    const nextPasswordHash = password ? hashPassword(password) : user.password_hash;
    await client.query(`
      update users
      set
        username = $9,
        password_hash = $2,
        full_name = $3,
        phone = $4,
        rank_id = $5,
        position_id = $6,
        team_id = $7,
        status = $8,
        updated_at = now()
      where username = $1
    `, [
      username,
      nextPasswordHash,
      fullname?.trim() || (user.is_admin ? 'Admin' : nextUsername),
      user.is_admin ? null : phone || null,
      rankId,
      positionId,
      teamId,
      user.is_admin ? 'Hoạt động' : (status === 'Tạm khóa' ? 'Tạm khóa' : 'Hoạt động'),
      nextUsername
    ]);
    if (!user.is_admin) {
      await client.query(`
        insert into staff_profiles (user_id, badge_number)
        values ($1, $2)
        on conflict (user_id) do nothing
      `, [user.id, toNullableText(badgeNumber)]);
      await client.query('update staff_profiles set badge_number = $2, updated_at = now() where user_id = $1', [user.id, toNullableText(badgeNumber)]);
    }
    await logActivity(req, {
      action: 'Cập nhật tài khoản',
      moduleKey: 'permissions',
      moduleName: 'Hệ thống & Phân quyền',
      detail: `Cập nhật tài khoản ${nextUsername}`,
      metadata: { username: nextUsername, previousUsername: username, fullname, phone, rank, position, team, status }
    }, client);
    await client.query('commit');
    res.json({ ok: true, username: nextUsername });
  } catch (error) {
    await client.query('rollback');
    if (error.code === '23505') {
      res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
}));

function normalizeDeletionUsernames(value) {
  return [...new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item).trim())
      .filter((item) => item && item !== 'admin')
  )];
}

async function getAccountDeletionImpact(client, usernames) {
  if (!usernames.length) return { accounts: [], assets: [], eligibleRecipients: [] };
  const accounts = await client.query(`
    select id, username, full_name
    from users
    where username = any($1::text[])
      and is_admin = false
      and is_deleted = false
    order by full_name
  `, [usernames]);
  const userIds = accounts.rows.map((row) => row.id);
  const assets = userIds.length
    ? await client.query(`
        select
          a.id,
          a.asset_code,
          a.name,
          a.manager_user_id,
          u.username as manager_username,
          u.full_name as manager_name
        from assets a
        join users u on u.id = a.manager_user_id
        where a.manager_user_id = any($1::bigint[])
        order by u.full_name, a.asset_code
      `, [userIds])
    : { rows: [] };
  const eligibleRecipients = await client.query(`
    select
      u.username,
      u.full_name,
      coalesce(t.name, '') as team
    from users u
    left join teams t on t.id = u.team_id
    where u.is_admin = false
      and u.is_deleted = false
      and u.status = 'Hoạt động'
      and not (u.username = any($1::text[]))
    order by u.full_name
  `, [usernames]);
  return {
    accounts: accounts.rows.map((account) => ({
      ...account,
      assets: assets.rows.filter((asset) => String(asset.manager_user_id) === String(account.id))
    })),
    assets: assets.rows,
    eligibleRecipients: eligibleRecipients.rows
  };
}

app.post('/api/accounts/deletion-check', asyncHandler(async (req, res) => {
  if (getActor(req) !== 'admin') {
    res.status(403).json({ error: 'Chỉ Admin được xóa tài khoản' });
    return;
  }
  const usernames = normalizeDeletionUsernames(req.body?.usernames);
  if (!usernames.length) {
    res.status(400).json({ error: 'Chưa chọn tài khoản hợp lệ để xóa' });
    return;
  }
  const client = await pool.connect();
  try {
    const impact = await getAccountDeletionImpact(client, usernames);
    res.json({
      usernames,
      accounts: impact.accounts,
      assetCount: impact.assets.length,
      requiresTransfer: impact.assets.length > 0,
      eligibleRecipients: impact.eligibleRecipients
    });
  } finally {
    client.release();
  }
}));

app.delete('/api/accounts', asyncHandler(async (req, res) => {
  if (getActor(req) !== 'admin') {
    res.status(403).json({ error: 'Chỉ Admin được xóa tài khoản' });
    return;
  }
  const filtered = normalizeDeletionUsernames(req.body?.usernames);
  const transferToUsername = String(req.body?.transferToUsername || '').trim();
  if (!filtered.length) {
    res.status(400).json({ error: 'Chưa chọn tài khoản hợp lệ để xóa' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const lockedUsers = await client.query(`
      select id, username, full_name
      from users
      where username = any($1::text[])
        and is_admin = false
        and is_deleted = false
      for update
    `, [filtered]);
    if (!lockedUsers.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy tài khoản cần xóa' });
      return;
    }
    const deletingUsernames = lockedUsers.rows.map((row) => row.username);
    const impact = await getAccountDeletionImpact(client, deletingUsernames);
    let transferTarget = null;
    if (impact.assets.length) {
      if (!transferToUsername) {
        await client.query('rollback');
        res.status(409).json({
          error: 'Tài khoản đang được bàn giao tài sản. Vui lòng chọn tài khoản nhận bàn giao trước khi xóa.',
          code: 'ASSET_TRANSFER_REQUIRED',
          assetCount: impact.assets.length,
          accounts: impact.accounts,
          eligibleRecipients: impact.eligibleRecipients
        });
        return;
      }
      const targetResult = await client.query(`
        select id, username, full_name, team_id
        from users
        where username = $1
          and is_admin = false
          and is_deleted = false
          and status = 'Hoạt động'
          and not (username = any($2::text[]))
        for update
      `, [transferToUsername, deletingUsernames]);
      if (!targetResult.rows.length) {
        await client.query('rollback');
        res.status(400).json({ error: 'Tài khoản nhận bàn giao không hợp lệ hoặc đang bị xóa' });
        return;
      }
      transferTarget = targetResult.rows[0];
      const deletedUserIds = lockedUsers.rows.map((row) => row.id);
      const transferredAssets = await client.query(`
        update assets
        set
          manager_user_id = $1,
          team_id = coalesce($2, team_id),
          updated_at = now()
        where manager_user_id = any($3::bigint[])
        returning id, asset_code, name
      `, [transferTarget.id, transferTarget.team_id, deletedUserIds]);
      await client.query(`
        update asset_assignments
        set returned_at = current_date
        where assigned_to_user_id = any($1::bigint[])
          and returned_at is null
      `, [deletedUserIds]);
      if (transferredAssets.rows.length) {
        await client.query(`
          insert into asset_assignments (
            asset_id, assigned_to_user_id, assigned_to_team_id, assigned_at, note
          )
          select
            transferred.id,
            $1,
            $2,
            current_date,
            $3
          from unnest($4::bigint[]) as transferred(id)
        `, [
          transferTarget.id,
          transferTarget.team_id,
          `Chuyển tài sản khi xóa tài khoản: ${deletingUsernames.join(', ')}`,
          transferredAssets.rows.map((row) => row.id)
        ]);
      }
      await client.query(`
        update handover_recipients
        set
          manager_user_id = $1,
          team_id = coalesce($2, team_id),
          updated_at = now()
        where manager_user_id = any($3::bigint[])
      `, [transferTarget.id, transferTarget.team_id, deletedUserIds]);
    }
    const result = await client.query(`
      update users
      set is_deleted = true, updated_at = now()
      where username = any($1::text[])
        and is_admin = false
        and is_deleted = false
      returning username
    `, [deletingUsernames]);
    await logActivity(req, {
      action: transferTarget ? 'Chuyển tài sản và xóa tài khoản' : 'Xóa tài khoản',
      moduleKey: 'permissions',
      moduleName: 'Hệ thống & Phân quyền',
      detail: transferTarget
        ? `Chuyển ${impact.assets.length} tài sản sang ${transferTarget.username} và xóa mềm ${result.rows.length} tài khoản`
        : `Xóa mềm ${result.rows.length} tài khoản`,
      metadata: {
        usernames: result.rows.map((row) => row.username),
        transferredAssetCodes: impact.assets.map((asset) => asset.asset_code),
        transferToUsername: transferTarget?.username || null
      }
    }, client);
    await client.query('commit');
    res.json({
      ok: true,
      deleted: result.rows.map((row) => row.username),
      transferredAssetCount: impact.assets.length,
      transferToUsername: transferTarget?.username || null
    });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/modules', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select id, module_key, name, description, icon, visible, is_admin_only, is_custom
    from modules
    order by id
  `);
  res.json(rows);
}));

app.post('/api/modules', asyncHandler(async (req, res) => {
  const {
    moduleKey,
    name,
    description = '',
    icon = 'blocks',
    visible = true,
    isAdminOnly = false
  } = req.body;
  if (!moduleKey || !name) {
    res.status(400).json({ error: 'Thiếu mã module hoặc tên module' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const inserted = await client.query(`
      insert into modules (module_key, name, description, icon, visible, is_admin_only, is_custom)
      values ($1, $2, $3, $4, $5, $6, true)
      returning id, module_key
    `, [moduleKey, name, description, icon, Boolean(visible), Boolean(isAdminOnly)]);
    await syncModulePermissions(client);
    await logActivity(req, {
      action: 'Tạo module',
      moduleKey: 'moduleManager',
      moduleName: 'Quản lý module',
      detail: `Tạo module ${name}`,
      metadata: { moduleKey, name, description, icon, visible, isAdminOnly }
    }, client);
    await client.query('commit');
    res.status(201).json({ ok: true, moduleKey: inserted.rows[0].module_key });
  } catch (error) {
    await client.query('rollback');
    if (error.code === '23505') {
      res.status(409).json({ error: 'Module đã tồn tại' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
}));

app.put('/api/modules/:moduleKey', asyncHandler(async (req, res) => {
  const { moduleKey } = req.params;
  const { name, description, visible, icon } = req.body;
  const client = await pool.connect();
  try {
    await client.query('begin');
    const result = await client.query(`
      update modules
      set
        name = coalesce($2, name),
        description = coalesce($3, description),
        icon = coalesce($4, icon),
        visible = coalesce($5, visible)
      where module_key = $1
      returning id, module_key, name
    `, [
      moduleKey,
      name ?? null,
      description ?? null,
      icon ?? null,
      typeof visible === 'boolean' ? visible : null
    ]);
    if (!result.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy module' });
      return;
    }
    await syncModulePermissions(client);
    await logActivity(req, {
      action: 'Cập nhật module',
      moduleKey: 'moduleManager',
      moduleName: 'Quản lý module',
      detail: `Cập nhật module ${moduleKey}`,
      metadata: { moduleKey, name, description, visible, icon }
    }, client);
    await client.query('commit');
    res.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    if (error.code === '23505') {
      res.status(409).json({ error: 'Tên module đã được sử dụng' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
}));

app.delete('/api/modules/:moduleKey', asyncHandler(async (req, res) => {
  const { moduleKey } = req.params;
  const client = await pool.connect();
  try {
    await client.query('begin');
    const moduleResult = await client.query('select id from modules where module_key = $1', [moduleKey]);
    if (!moduleResult.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy module' });
      return;
    }
    await client.query('delete from permissions where module_id = $1', [moduleResult.rows[0].id]);
    await client.query('delete from modules where id = $1', [moduleResult.rows[0].id]);
    await logActivity(req, {
      action: 'Xóa module',
      moduleKey: 'moduleManager',
      moduleName: 'Quản lý module',
      detail: `Xóa module ${moduleKey}`,
      metadata: { moduleKey }
    }, client);
    await client.query('commit');
    res.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/permissions', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      p.id,
      p.name,
      m.module_key
    from permissions p
    join modules m on m.id = p.module_id
    where m.module_key not in ('permissions', 'staff')
    order by m.id
  `);
  res.json(rows);
}));

app.delete('/api/permissions/:name', asyncHandler(async (req, res) => {
  const name = req.params.name;
  const client = await pool.connect();
  try {
    await client.query('begin');
    const permissionResult = await client.query('select id from permissions where name = $1', [name]);
    if (!permissionResult.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy quyền' });
      return;
    }
    await client.query('delete from user_permissions where permission_id = $1', [permissionResult.rows[0].id]);
    await client.query('delete from permissions where id = $1', [permissionResult.rows[0].id]);
    await logActivity(req, {
      action: 'Xóa quyền',
      moduleKey: 'permissions',
      moduleName: 'Hệ thống & Phân quyền',
      detail: `Xóa quyền ${name}`,
      metadata: { permission: name }
    }, client);
    await client.query('commit');
    res.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/user-permissions', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select u.username, p.name as permission_name
    from users u
    left join user_permissions up on up.user_id = u.id
    left join permissions p on p.id = up.permission_id
    where u.is_deleted = false
    order by u.id, p.id
  `);
  const result = {};
  for (const row of rows) {
    if (!result[row.username]) result[row.username] = [];
    if (row.permission_name) result[row.username].push(row.permission_name);
  }
  res.json(result);
}));

app.put('/api/user-permissions/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  const permissions = Array.isArray(req.body?.permissions) ? req.body.permissions : [];
  const client = await pool.connect();
  try {
    await client.query('begin');
    const userResult = await client.query('select id from users where username = $1 and is_deleted = false', [username]);
    if (!userResult.rows.length) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy tài khoản' });
      return;
    }
    await client.query('delete from user_permissions where user_id = $1', [userResult.rows[0].id]);
    if (permissions.length) {
      await client.query(`
        insert into user_permissions (user_id, permission_id)
        select $1, p.id
        from permissions p
        where p.name = any($2::text[])
      `, [userResult.rows[0].id, permissions]);
    }
    await logActivity(req, {
      action: 'Lưu phân quyền',
      moduleKey: 'permissions',
      moduleName: 'Hệ thống & Phân quyền',
      detail: `Cập nhật ${permissions.length} quyền cho ${username}`,
      metadata: { username, permissions }
    }, client);
    await client.query('commit');
    res.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/catalogs', asyncHandler(async (_req, res) => {
  const [positions, ranks, teams] = await Promise.all([
    query('select name from positions order by id'),
    query('select name from ranks order by id'),
    query('select name from teams order by id')
  ]);
  res.json({
    positions: positions.map((row) => row.name),
    ranks: ranks.map((row) => row.name),
    teams: teams.map((row) => row.name)
  });
}));

app.post('/api/catalogs/:type', asyncHandler(async (req, res) => {
  const tableMap = {
    positions: 'positions',
    ranks: 'ranks'
  };
  const table = tableMap[req.params.type];
  const name = String(req.body?.name || '').trim();
  if (!table || !name) {
    res.status(400).json({ error: 'Tên danh mục không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(`insert into ${table} (name) values ($1) returning name`, [name]);
    await logActivity(req, {
      action: 'Thêm danh mục',
      moduleKey: 'catalogManager',
      moduleName: 'Quản lý danh mục',
      detail: `Thêm ${req.params.type === 'positions' ? 'chức vụ' : 'chức hàm'} ${name}`,
      metadata: { type: req.params.type, name }
    });
    res.status(201).json({ ok: true, name: result.rows[0].name });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Danh mục đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.put('/api/catalogs/:type/:oldName', asyncHandler(async (req, res) => {
  const tableMap = {
    positions: 'positions',
    ranks: 'ranks'
  };
  const table = tableMap[req.params.type];
  const oldName = req.params.oldName;
  const name = String(req.body?.name || '').trim();
  if (!table || !oldName || !name) {
    res.status(400).json({ error: 'Danh mục cập nhật không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(`update ${table} set name = $2, updated_at = now() where name = $1 returning name`, [oldName, name]);
    if (!result.rows.length) {
      res.status(404).json({ error: 'Không tìm thấy danh mục' });
      return;
    }
    await logActivity(req, {
      action: 'Cập nhật danh mục',
      moduleKey: 'catalogManager',
      moduleName: 'Quản lý danh mục',
      detail: `Đổi ${oldName} thành ${name}`,
      metadata: { type: req.params.type, oldName, name }
    });
    res.json({ ok: true, name: result.rows[0].name });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Danh mục đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.delete('/api/catalogs/:type', asyncHandler(async (req, res) => {
  const tableMap = {
    positions: 'positions',
    ranks: 'ranks'
  };
  const table = tableMap[req.params.type];
  const names = Array.isArray(req.body?.names) ? req.body.names.map((item) => String(item).trim()).filter(Boolean) : [];
  if (!table || !names.length) {
    res.status(400).json({ error: 'Danh mục xóa không hợp lệ' });
    return;
  }
  const result = await pool.query(`delete from ${table} where name = any($1::text[]) returning name`, [names]);
  await logActivity(req, {
    action: 'Xóa danh mục',
    moduleKey: 'catalogManager',
    moduleName: 'Quản lý danh mục',
    detail: `Xóa ${result.rows.length} danh mục`,
    metadata: { type: req.params.type, names: result.rows.map((row) => row.name) }
  });
  res.json({ ok: true, deleted: result.rows.map((row) => row.name) });
}));

app.get('/api/departments', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      d.id,
      d.name,
      coalesce(d.unit_type, 'Cấp phòng') as unit_type,
      pd.name as parent_name,
      count(distinct t.id)::int as team_count,
      count(distinct u.id)::int as staff_count,
      count(distinct a.id)::int as asset_count
    from departments d
    left join departments pd on pd.id = d.parent_id
    left join teams t on t.department_id = d.id
    left join users u on u.team_id = t.id and u.is_deleted = false
    left join assets a on a.team_id = t.id
    group by d.id, d.name, d.unit_type, pd.name
    order by case coalesce(d.unit_type, 'Cấp phòng') when 'Cấp phòng' then 1 when 'Cấp xã' then 2 else 3 end, d.id
  `);
  res.json(rows);
}));

app.post('/api/departments', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const unitType = ['Cấp phòng', 'Cấp xã'].includes(req.body?.unitType) ? req.body.unitType : 'Cấp phòng';
  if (!name) {
    res.status(400).json({ error: 'Tên đơn vị không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(`
      insert into departments (name, unit_type)
      values ($1, $2)
      returning id, name, unit_type
    `, [name, unitType]);
    await logActivity(req, {
      action: 'Thêm đơn vị',
      moduleKey: 'teamManager',
      moduleName: 'Quản lý đơn vị',
      detail: `Thêm ${unitType.toLowerCase()} ${name}`,
      metadata: { department: result.rows[0] }
    });
    res.status(201).json({ ok: true, department: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Đơn vị đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.put('/api/departments/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const name = String(req.body?.name || '').trim();
  const unitType = ['Cấp phòng', 'Cấp xã'].includes(req.body?.unitType) ? req.body.unitType : 'Cấp phòng';
  if (!id || !name) {
    res.status(400).json({ error: 'Đơn vị cập nhật không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(`
      update departments
      set name = $2, unit_type = $3, updated_at = now()
      where id = $1
      returning id, name, unit_type
    `, [id, name, unitType]);
    if (!result.rows.length) {
      res.status(404).json({ error: 'Không tìm thấy đơn vị' });
      return;
    }
    await logActivity(req, {
      action: 'Cập nhật đơn vị',
      moduleKey: 'teamManager',
      moduleName: 'Quản lý đơn vị',
      detail: `Cập nhật đơn vị ${name}`,
      metadata: { id, name, unitType }
    });
    res.json({ ok: true, department: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Đơn vị đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.delete('/api/departments/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Đơn vị xóa không hợp lệ' });
    return;
  }
  const linked = await query(`
    select count(*)::int as team_count
    from teams
    where department_id = $1
  `, [id]);
  if ((linked[0]?.team_count || 0) > 0) {
    res.status(409).json({ error: 'Không thể xóa đơn vị đang có đội trực thuộc' });
    return;
  }
  const result = await pool.query('delete from departments where id = $1 returning id, name', [id]);
  if (!result.rows.length) {
    res.status(404).json({ error: 'Không tìm thấy đơn vị' });
    return;
  }
  await logActivity(req, {
    action: 'Xóa đơn vị',
    moduleKey: 'teamManager',
    moduleName: 'Quản lý đơn vị',
    detail: `Xóa đơn vị ${result.rows[0].name}`,
    metadata: { id }
  });
  res.json({ ok: true });
}));

app.get('/api/teams', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      t.id,
      t.name,
      d.id as department_id,
      d.name as department,
      coalesce(d.unit_type, 'Cấp phòng') as unit_type,
      count(distinct u.id)::int as staff_count,
      count(distinct a.id)::int as asset_count
    from teams t
    left join departments d on d.id = t.department_id
    left join users u on u.team_id = t.id and u.is_deleted = false
    left join assets a on a.team_id = t.id
    group by t.id, t.name, d.id, d.name, d.unit_type
    order by t.id
  `);
  res.json(rows);
}));

app.post('/api/teams', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const departmentId = Number(req.body?.departmentId || req.body?.department_id) || null;
  if (!name) {
    res.status(400).json({ error: 'Tên đội không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(`
      insert into teams (department_id, name)
      values (coalesce($2, (select id from departments order by id limit 1)), $1)
      returning id, name, department_id
    `, [name, departmentId]);
    await logActivity(req, {
      action: 'Thêm đội',
      moduleKey: 'teamManager',
      moduleName: 'Quản lý đơn vị',
      detail: `Thêm đội ${name}`,
      metadata: { team: result.rows[0] }
    });
    res.status(201).json({ ok: true, team: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Đội đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.put('/api/teams/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const name = String(req.body?.name || '').trim();
  const departmentId = Number(req.body?.departmentId || req.body?.department_id) || null;
  if (!id || !name) {
    res.status(400).json({ error: 'Đội cập nhật không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query(
      'update teams set name = $2, department_id = coalesce($3, department_id) where id = $1 returning id, name, department_id',
      [id, name, departmentId]
    );
    if (!result.rows.length) {
      res.status(404).json({ error: 'Không tìm thấy đội' });
      return;
    }
    await logActivity(req, {
      action: 'Cập nhật đội',
      moduleKey: 'teamManager',
      moduleName: 'Quản lý đơn vị',
      detail: `Cập nhật đội ${name}`,
      metadata: { id, name, departmentId }
    });
    res.json({ ok: true, team: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Đội đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.delete('/api/teams/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Đội xóa không hợp lệ' });
    return;
  }
  const linked = await query(`
    select
      (select count(*)::int from users where team_id = $1 and is_deleted = false) as staff_count,
      (select count(*)::int from assets where team_id = $1) as asset_count
  `, [id]);
  if ((linked[0]?.staff_count || 0) > 0 || (linked[0]?.asset_count || 0) > 0) {
    res.status(409).json({ error: 'Không thể xóa đội đang có cán bộ hoặc tài sản liên kết' });
    return;
  }
  const result = await pool.query('delete from teams where id = $1 returning id', [id]);
  if (!result.rows.length) {
    res.status(404).json({ error: 'Không tìm thấy đội' });
    return;
  }
  await logActivity(req, {
    action: 'Xóa đội',
    moduleKey: 'teamManager',
    moduleName: 'Quản lý đơn vị',
    detail: `Xóa đội ID ${id}`,
    metadata: { id }
  });
  res.json({ ok: true });
}));

app.get('/api/staff', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      u.id as user_id,
      u.username,
      u.full_name,
      u.phone,
      coalesce(r.name, '') as rank,
      coalesce(pos.name, '') as position,
      coalesce(t.name, '') as team,
      sp.badge_number,
      sp.birth_date,
      sp.gender,
      sp.ethnicity,
      sp.citizen_id,
      sp.citizen_issued_date,
      sp.permanent_address,
      sp.current_address,
      sp.joined_date,
      sp.education_level,
      sp.school_name,
      sp.major,
      sp.graduation_year,
      sp.training_type,
      sp.foreign_language,
      sp.marital_status,
      sp.email,
      sp.note,
      sp.avatar_url
    from users u
    left join staff_profiles sp on sp.user_id = u.id
    left join ranks r on r.id = u.rank_id
    left join positions pos on pos.id = u.position_id
    left join teams t on t.id = u.team_id
    where u.is_admin = false and u.is_deleted = false
    order by u.id
  `);
  res.json(rows);
}));

app.put('/api/staff/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  const sections = req.body?.sections || {};
  const photo = req.body?.photo || '';
  const photoValidation = validateAvatarPhoto(photo);
  if (photoValidation.error) {
    res.status(photoValidation.status || 400).json({ error: photoValidation.error });
    return;
  }
  const personal = sections['Thông tin cá nhân'] || {};
  const work = sections['Thông tin công tác'] || {};
  const education = sections['Trình độ đào tạo'] || {};
  const other = sections['Thông tin khác'] || {};
  const fullname = toNullableText(personal['Họ và tên']);
  const badgeNumber = toNullableText(personal['Số hiệu']);
  const phone = toNullableText(other['Số điện thoại'] || personal['Số điện thoại']);

  const client = await pool.connect();
  try {
    await client.query('begin');
    const current = await client.query('select id, is_admin from users where username = $1 and is_deleted = false', [username]);
    if (!current.rows.length || current.rows[0].is_admin) {
      await client.query('rollback');
      res.status(404).json({ error: 'Không tìm thấy hồ sơ cán bộ' });
      return;
    }
    const userId = current.rows[0].id;
    const rankId = await findCatalogId(client, 'ranks', work['Cấp bậc']);
    const positionId = await findCatalogId(client, 'positions', work['Chức vụ hiện tại']);
    const teamId = await findCatalogId(client, 'teams', work['Đơn vị công tác']);
    await client.query(`
      update users
      set
        full_name = coalesce($2, full_name),
        phone = $3,
        rank_id = $4,
        position_id = $5,
        team_id = $6,
        updated_at = now()
      where id = $1
    `, [userId, fullname, phone, rankId, positionId, teamId]);
    await client.query(`
      insert into staff_profiles (
        user_id, badge_number, birth_date, gender, ethnicity, citizen_id, citizen_issued_date,
        permanent_address, current_address, joined_date, education_level,
        school_name, major, graduation_year, training_type, foreign_language,
        marital_status, email, note, avatar_url
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      on conflict (user_id) do update
      set
        badge_number = excluded.badge_number,
        birth_date = excluded.birth_date,
        gender = excluded.gender,
        ethnicity = excluded.ethnicity,
        citizen_id = excluded.citizen_id,
        citizen_issued_date = excluded.citizen_issued_date,
        permanent_address = excluded.permanent_address,
        current_address = excluded.current_address,
        joined_date = excluded.joined_date,
        education_level = excluded.education_level,
        school_name = excluded.school_name,
        major = excluded.major,
        graduation_year = excluded.graduation_year,
        training_type = excluded.training_type,
        foreign_language = excluded.foreign_language,
        marital_status = excluded.marital_status,
        email = excluded.email,
        note = excluded.note,
        avatar_url = excluded.avatar_url,
        updated_at = now()
    `, [
      userId,
      badgeNumber,
      toDbDate(personal['Ngày sinh']),
      toNullableText(personal['Giới tính']),
      toNullableText(personal['Dân tộc']),
      toNullableText(personal['Số CCCD']),
      toDbDate(personal['Ngày cấp CCCD']),
      toNullableText(personal['Nơi thường trú']),
      toNullableText(personal['Nơi ở hiện nay']),
      toDbDate(work['Ngày vào ngành']),
      toNullableText(education['Trình độ học vấn'] || work['Trình độ chuyên môn']),
      toNullableText(education['Trường đào tạo']),
      toNullableText(education['Chuyên ngành'] || work['Chuyên ngành đào tạo']),
      education['Năm tốt nghiệp'] ? Number(education['Năm tốt nghiệp']) || null : null,
      toNullableText(education['Loại hình đào tạo']),
      toNullableText(education['Ngoại ngữ']),
      toNullableText(other['Tình trạng hôn nhân']),
      toNullableText(other['Email']),
      toNullableText(other['Ghi chú']),
      photoValidation.photo
    ]);
    await logActivity(req, {
      action: 'Cập nhật hồ sơ cán bộ',
      moduleKey: 'staffDirectory',
      moduleName: 'Quản lý cán bộ',
      detail: `Cập nhật hồ sơ ${username}`,
      metadata: { username, fullname, phone }
    }, client);
    await client.query('commit');
    res.json({ ok: true });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/asset-categories', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      ac.id,
      ac.name,
      count(a.id)::int as total,
      count(a.id) filter (where a.status in ('Đang sử dụng', 'Hoạt động'))::int as active,
      count(a.id) filter (where a.status in ('Bảo trì', 'Tạm dừng'))::int as maintenance,
      count(a.id) filter (where a.status = 'Hư')::int as broken
    from asset_categories ac
    left join assets a on a.category_id = ac.id
    group by ac.id, ac.name
    order by ac.id
  `);
  res.json(rows);
}));

app.post('/api/asset-categories', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) {
    res.status(400).json({ error: 'Tên loại tài sản không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query('insert into asset_categories (name) values ($1) returning name', [name]);
    await logActivity(req, {
      action: 'Thêm loại tài sản',
      moduleKey: 'assetCategoryManager',
      moduleName: 'Danh mục tài sản',
      detail: `Thêm loại tài sản ${name}`,
      metadata: { name }
    });
    res.status(201).json({ ok: true, name: result.rows[0].name });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Loại tài sản đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.put('/api/asset-categories/:oldName', asyncHandler(async (req, res) => {
  const oldName = req.params.oldName;
  const name = String(req.body?.name || '').trim();
  if (!oldName || !name) {
    res.status(400).json({ error: 'Loại tài sản cập nhật không hợp lệ' });
    return;
  }
  try {
    const result = await pool.query('update asset_categories set name = $2, updated_at = now() where name = $1 returning name', [oldName, name]);
    if (!result.rows.length) {
      res.status(404).json({ error: 'Không tìm thấy loại tài sản' });
      return;
    }
    await logActivity(req, {
      action: 'Cập nhật loại tài sản',
      moduleKey: 'assetCategoryManager',
      moduleName: 'Danh mục tài sản',
      detail: `Đổi loại tài sản ${oldName} thành ${name}`,
      metadata: { oldName, name }
    });
    res.json({ ok: true, name: result.rows[0].name });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Loại tài sản đã tồn tại' });
      return;
    }
    throw error;
  }
}));

app.delete('/api/asset-categories', asyncHandler(async (req, res) => {
  const names = Array.isArray(req.body?.names) ? req.body.names.map((item) => String(item).trim()).filter(Boolean) : [];
  if (!names.length) {
    res.status(400).json({ error: 'Chưa chọn loại tài sản để xóa' });
    return;
  }
  const linked = await query(`
    select distinct ac.name
    from asset_categories ac
    join assets a on a.category_id = ac.id
    where ac.name = any($1::text[])
  `, [names]);
  if (linked.length) {
    res.status(409).json({ error: `Không thể xóa loại đang có tài sản: ${linked.map((row) => row.name).join(', ')}` });
    return;
  }
  const result = await pool.query(
    'delete from asset_categories where name = any($1::text[]) returning name',
    [names]
  );
  await logActivity(req, {
    action: 'Xóa loại tài sản',
    moduleKey: 'assetCategoryManager',
    moduleName: 'Danh mục tài sản',
    detail: `Xóa ${result.rows.length} loại tài sản`,
    metadata: { names: result.rows.map((row) => row.name) }
  });
  res.json({ ok: true, deleted: result.rows.map((row) => row.name) });
}));

app.get('/api/handover-recipients', asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    const actor = await getActorAccount(client, req);
    if (!actor) {
      if (getActor(req) === 'system') {
        res.json([]);
        return;
      }
      res.status(401).json({ error: 'Tài khoản không hợp lệ' });
      return;
    }
    const result = await client.query(`
    select
      r.id,
      r.full_name,
      coalesce(r.badge_number, '') as badge_number,
      coalesce(r.phone, '') as phone,
      coalesce(r.note, '') as note,
      coalesce(t.name, '') as team,
      coalesce(manager.username, '') as manager_username,
      coalesce(manager.full_name, '') as manager_name,
      latest.handover_no,
      latest.handover_date,
      latest.file_name,
      latest.file_type,
      latest.file_data,
      coalesce(asset_codes.asset_codes, array[]::text[]) as asset_codes
    from handover_recipients r
    left join teams t on t.id = r.team_id
    left join users manager on manager.id = r.manager_user_id
    left join lateral (
      select h.id, coalesce(h.handover_no, '') as handover_no, h.handover_date, coalesce(h.file_name, '') as file_name, coalesce(h.file_type, '') as file_type, coalesce(h.file_data, '') as file_data
      from handover_records h
      where h.recipient_id = r.id
      order by h.handover_date desc, h.id desc
      limit 1
    ) latest on true
    left join lateral (
      select array_agg(distinct a.asset_code order by a.asset_code) as asset_codes
      from handover_records h
      join handover_record_assets hra on hra.record_id = h.id
      join assets a on a.id = hra.asset_id
      where h.recipient_id = r.id
    ) asset_codes on true
    order by t.name nulls last, r.full_name
  `);
    res.json(result.rows);
  } finally {
    client.release();
  }
}));

app.post('/api/handover-recipients', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || req.body?.fullName || '').trim();
  let unit = String(req.body?.unit || req.body?.team || '').trim();
  const assetIds = Array.isArray(req.body?.assetIds) ? req.body.assetIds.map((item) => String(item).trim()).filter(Boolean) : [];
  const fileValidation = validateHandoverFile({
    fileName: req.body?.fileName || req.body?.file_name,
    fileType: req.body?.fileType || req.body?.file_type,
    fileData: req.body?.fileData || req.body?.file_data
  });
  if (!name || !unit || !assetIds.length) {
    res.status(400).json({ error: 'Thiếu họ tên, đơn vị hoặc thiết bị bàn giao' });
    return;
  }
  if (fileValidation.error) {
    res.status(fileValidation.status || 400).json({ error: fileValidation.error });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const actor = await getActorAccount(client, req);
    if (!actor) {
      await client.query('rollback');
      res.status(401).json({ error: 'Tài khoản không hợp lệ' });
      return;
    }
    const teamId = await resolveTeamIdForAccount(client, { team: unit });
    if (!teamId) {
      await client.query('rollback');
      res.status(400).json({ error: 'Đội/Trạm bàn giao không hợp lệ' });
      return;
    }
    const validAssets = await client.query(`
      select asset_code
      from assets
      where team_id = $1 and asset_code = any($2::text[])
    `, [teamId, assetIds]);
    if (validAssets.rows.length !== new Set(assetIds).size) {
      await client.query('rollback');
      res.status(403).json({ error: 'Danh sách có thiết bị không thuộc đơn vị phụ trách' });
      return;
    }
    const managerUserId = actor.id;
    const recipient = await client.query(`
      insert into handover_recipients (team_id, manager_user_id, full_name, badge_number, phone, note)
      values ($1, $2, $3, $4, $5, $6)
      returning id
    `, [
      teamId,
      managerUserId,
      name,
      toNullableText(req.body?.badge || req.body?.badgeNumber),
      toNullableText(req.body?.phone),
      toNullableText(req.body?.note)
    ]);
    const record = await client.query(`
      insert into handover_records (recipient_id, handed_by_user_id, handover_no, handover_date, note, file_name, file_type, file_data)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id
    `, [
      recipient.rows[0].id,
      managerUserId,
      toNullableText(req.body?.handoverNo || req.body?.handover_no),
      toDbDate(req.body?.handoverDate || req.body?.handover_date) || new Date().toISOString().slice(0, 10),
      toNullableText(req.body?.note),
      fileValidation.fileName,
      fileValidation.fileType,
      fileValidation.fileData
    ]);
    if (assetIds.length) {
      await client.query(`
        insert into handover_record_assets (record_id, asset_id)
        select $1, id
        from assets
        where team_id = $3 and asset_code = any($2::text[])
        on conflict do nothing
      `, [record.rows[0].id, assetIds, teamId]);
    }
    await logActivity(req, {
      action: 'Lập biên bản bàn giao',
      moduleKey: 'assets',
      moduleName: 'Quản lý Tài sản',
      detail: `Bàn giao ${assetIds.length} thiết bị cho ${name}`,
      metadata: { recipient: name, unit, assetIds, handoverNo: req.body?.handoverNo || '' }
    }, client);
    await client.query('commit');
    res.status(201).json({ ok: true, id: recipient.rows[0].id });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/assets', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      a.id,
      a.asset_code,
      a.name,
      coalesce(ac.name, '') as category,
      a.received_date,
      coalesce(u.full_name, '') as owner,
      coalesce(t.name, '') as team,
      a.status,
      a.original_value,
      a.note
    from assets a
    left join asset_categories ac on ac.id = a.category_id
    left join users u on u.id = a.manager_user_id
    left join teams t on t.id = a.team_id
    order by a.id
  `);
  res.json(rows);
}));

app.post('/api/assets', asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const payload = await buildAssetPayload(client, req.body || {});
    if (payload.error) {
      await client.query('rollback');
      res.status(400).json({ error: payload.error });
      return;
    }
    const result = await client.query(`
      insert into assets (
        asset_code, name, category_id, received_date, manager_user_id, team_id, status, original_value, note
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id, asset_code
    `, [
      payload.assetCode,
      payload.name,
      payload.categoryId,
      payload.receivedDate,
      payload.managerUserId,
      payload.teamId,
      payload.status,
      payload.originalValue,
      payload.note
    ]);
    await logActivity(req, {
      action: 'Thêm tài sản',
      moduleKey: 'assets',
      moduleName: 'Quản lý Tài sản',
      detail: `Thêm tài sản ${payload.assetCode} - ${payload.name}`,
      metadata: { assetCode: payload.assetCode, name: payload.name, status: payload.status }
    }, client);
    await client.query('commit');
    res.status(201).json({ ok: true, id: result.rows[0].id, assetCode: result.rows[0].asset_code });
  } catch (error) {
    await client.query('rollback');
    if (error.code === '23505') {
      res.status(409).json({ error: 'Mã tài sản đã tồn tại' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
}));

app.put('/api/assets/:assetCode', asyncHandler(async (req, res) => {
  const { assetCode } = req.params;
  const client = await pool.connect();
  try {
    await client.query('begin');
    const payload = await buildAssetPayload(client, { ...req.body, id: assetCode });
    if (payload.error) {
      await client.query('rollback');
      res.status(400).json({ error: payload.error });
      return;
    }
    const result = await client.query(`
      update assets
      set
        name = $2,
        category_id = $3,
        received_date = $4,
        manager_user_id = $5,
        team_id = $6,
        status = $7,
        original_value = $8,
        note = $9,
        updated_at = now()
      where asset_code = $1
      returning asset_code
    `, [
      assetCode,
      payload.name,
      payload.categoryId,
      payload.receivedDate,
      payload.managerUserId,
      payload.teamId,
      payload.status,
      payload.originalValue,
      payload.note
    ]);
    await logActivity(req, {
      action: 'Cập nhật tài sản',
      moduleKey: 'assets',
      moduleName: 'Quản lý Tài sản',
      detail: `Cập nhật tài sản ${assetCode}`,
      metadata: { assetCode, name: payload.name, status: payload.status }
    }, client);
    await client.query('commit');
    if (!result.rows.length) {
      res.status(404).json({ error: 'Không tìm thấy tài sản' });
      return;
    }
    res.json({ ok: true, assetCode: result.rows[0].asset_code });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.delete('/api/assets', asyncHandler(async (req, res) => {
  const assetCodes = Array.isArray(req.body?.assetCodes) ? req.body.assetCodes : [];
  const filtered = assetCodes.map((item) => String(item).trim()).filter(Boolean);
  if (!filtered.length) {
    res.status(400).json({ error: 'Chưa chọn tài sản để xóa' });
    return;
  }
  const result = await pool.query(
    'delete from assets where asset_code = any($1::text[]) returning asset_code',
    [filtered]
  );
  await logActivity(req, {
    action: 'Xóa tài sản',
    moduleKey: 'assets',
    moduleName: 'Quản lý Tài sản',
    detail: `Xóa ${result.rows.length} tài sản`,
    metadata: { assetCodes: result.rows.map((row) => row.asset_code) }
  });
  res.json({ ok: true, deleted: result.rows.map((row) => row.asset_code) });
}));

app.get('/api/inventories', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select
      s.id,
      s.name,
      s.inventory_date,
      s.status,
      coalesce(s.note, '') as note,
      coalesce(s.created_by, '') as created_by,
      s.created_at,
      count(i.id)::int as total_items,
      count(i.id) filter (where i.checked)::int as checked_items,
      count(i.id) filter (where i.checked and coalesce(i.actual_status, i.expected_status, '') <> coalesce(i.expected_status, ''))::int as changed_items
    from inventory_sessions s
    left join inventory_items i on i.session_id = s.id
    group by s.id
    order by s.inventory_date desc, s.id desc
  `);
  res.json(rows);
}));

app.post('/api/inventories', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim() || `Kiểm kê tài sản ${new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
  const inventoryDate = toDbDate(req.body?.inventoryDate || req.body?.inventory_date) || new Date().toISOString().slice(0, 10);
  const note = toNullableText(req.body?.note);
  const assetCodes = Array.isArray(req.body?.assetCodes)
    ? req.body.assetCodes.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const client = await pool.connect();
  try {
    await client.query('begin');
    const inserted = await client.query(`
      insert into inventory_sessions (name, inventory_date, note, created_by)
      values ($1, $2, $3, $4)
      returning id, name
    `, [name, inventoryDate, note, getActor(req)]);
    const params = [inserted.rows[0].id];
    let filterSql = '';
    if (assetCodes.length) {
      params.push(assetCodes);
      filterSql = `where asset_code = any($${params.length}::text[])`;
    }
    await client.query(`
      insert into inventory_items (session_id, asset_id, expected_status, actual_status)
      select $1, id, status, status
      from assets
      ${filterSql}
      on conflict (session_id, asset_id) do nothing
    `, params);
    await logActivity(req, {
      action: 'Tạo đợt kiểm kê',
      moduleKey: 'assets',
      moduleName: 'Quản lý Tài sản',
      detail: `Tạo đợt kiểm kê ${name}`,
      metadata: { inventoryId: inserted.rows[0].id, name, assetCodes }
    }, client);
    await client.query('commit');
    res.status(201).json({ ok: true, id: inserted.rows[0].id, name: inserted.rows[0].name });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/inventories/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Mã đợt kiểm kê không hợp lệ' });
    return;
  }
  const [session] = await query(`
    select id, name, inventory_date, status, coalesce(note, '') as note, coalesce(created_by, '') as created_by, created_at
    from inventory_sessions
    where id = $1
  `, [id]);
  if (!session) {
    res.status(404).json({ error: 'Không tìm thấy đợt kiểm kê' });
    return;
  }
  const items = await query(`
    select
      i.id,
      a.asset_code,
      a.name,
      coalesce(ac.name, '') as category,
      coalesce(u.full_name, '') as owner,
      coalesce(t.name, '') as team,
      i.expected_status,
      i.actual_status,
      i.checked,
      coalesce(i.checked_by, '') as checked_by,
      i.checked_at,
      coalesce(i.note, '') as note
    from inventory_items i
    join assets a on a.id = i.asset_id
    left join asset_categories ac on ac.id = a.category_id
    left join users u on u.id = a.manager_user_id
    left join teams t on t.id = a.team_id
    where i.session_id = $1
    order by a.asset_code
  `, [id]);
  res.json({ session, items });
}));

app.put('/api/inventories/:id/items/:assetCode', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const assetCode = String(req.params.assetCode || '').trim();
  if (!Number.isFinite(id) || !assetCode) {
    res.status(400).json({ error: 'Thiếu đợt kiểm kê hoặc mã tài sản' });
    return;
  }
  const actualStatus = normalizeAssetStatusValue(req.body?.actualStatus || req.body?.actual_status);
  const checked = req.body?.checked !== false;
  const note = toNullableText(req.body?.note);
  const result = await pool.query(`
    update inventory_items i
    set
      actual_status = $3,
      checked = $4,
      checked_by = case when $4 then $5 else null end,
      checked_at = case when $4 then now() else null end,
      note = $6,
      updated_at = now()
    from assets a
    where i.asset_id = a.id
      and i.session_id = $1
      and a.asset_code = $2
    returning i.id
  `, [id, assetCode, actualStatus, checked, getActor(req), note]);
  if (!result.rows.length) {
    res.status(404).json({ error: 'Không tìm thấy tài sản trong đợt kiểm kê' });
    return;
  }
  await logActivity(req, {
    action: 'Cập nhật kiểm kê',
    moduleKey: 'assets',
    moduleName: 'Quản lý Tài sản',
    detail: `Cập nhật kiểm kê tài sản ${assetCode}`,
    metadata: { inventoryId: id, assetCode, actualStatus, checked }
  });
  res.json({ ok: true });
}));

app.get('/api/reports/assets-by-category', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select ac.name as label, count(a.id)::int as value
    from asset_categories ac
    left join assets a on a.category_id = ac.id
    group by ac.id, ac.name
    order by ac.id
  `);
  res.json(rows);
}));

app.get('/api/reports/assets-by-team', asyncHandler(async (_req, res) => {
  const rows = await query(`
    select coalesce(t.name, 'Chưa gán đội') as label, count(a.id)::int as value
    from assets a
    left join teams t on t.id = a.team_id
    group by t.name
    order by value desc, label
  `);
  res.json(rows);
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(appRoot, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`TTTTCH demo running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Không khởi tạo được schema PostgreSQL', error);
    process.exit(1);
  });
