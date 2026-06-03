import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://apple@127.0.0.1:5432/ttttch_demo'
});

export async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}
