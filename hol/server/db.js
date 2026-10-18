require('dotenv').config();
const mysql = require('mysql2/promise');
const sslOptions = require('./lib/ssl');

module.exports = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hope_of_light',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,   // return DECIMAL columns as JS numbers
  charset: 'utf8mb4',
  ssl: sslOptions()
});
