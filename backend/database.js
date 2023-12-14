const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "testuser",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "ITU",
  waitForConnections: true,
  charset: "utf8_general_ci",
});

module.exports = pool;
