import pg from 'pg';

const { Pool } = pg;

const localDatabaseUrl = 'postgres://apple@127.0.0.1:5432/ttttch_demo';
const databaseUrl = process.env.DATABASE_URL || (process.env.NODE_ENV === 'production' ? '' : localDatabaseUrl);

if (!databaseUrl) {
  throw new Error('Thiếu DATABASE_URL. Vui lòng cấu hình biến môi trường DATABASE_URL trên server.');
}

function isLocalDatabase(url) {
  try {
    const host = new URL(url).hostname;
    return ['127.0.0.1', 'localhost', '::1'].includes(host);
  } catch (_error) {
    return false;
  }
}

const sslMode = String(process.env.PGSSLMODE || '').toLowerCase();
const databaseSsl = String(process.env.DATABASE_SSL || '').toLowerCase();
const useSsl = databaseSsl === 'true'
  || sslMode === 'require'
  || (process.env.NODE_ENV === 'production' && !isLocalDatabase(databaseUrl) && sslMode !== 'disable' && databaseSsl !== 'false');

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined
});

export async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}
