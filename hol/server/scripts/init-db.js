// Creates the tables from schema.sql:  npm run db:init   (local)   |   npm run db:init:cloud   (hosted DB)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const sslOptions = require('../lib/ssl');

(async () => {
  const hosted = process.env.DB_SSL === 'true';          // hosted databases already exist; we only create tables
  const name = process.env.DB_NAME || 'hope_of_light';
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
    database: hosted ? name : undefined, ssl: sslOptions(), multipleStatements: true
  });
  let sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  if (hosted) sql = sql.replace(/^\s*(CREATE DATABASE|USE)\b.*$/gim, '');
  else if (name !== 'hope_of_light') sql = sql.replace(/hope_of_light/g, name.replace(/[^\w]/g, ''));
  await conn.query(sql);
  console.log(`Database "${name}" is ready.`);
  await conn.end();
})().catch(e => { console.error('DB init failed:', e.message); process.exit(1); });
