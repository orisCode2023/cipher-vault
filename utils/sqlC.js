import mysql from "mysql2/promise";

export async function initDb() {
  const sqlConn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
  });

  const CREATE_DB_QUERY = `CREATE DATABASE IF NOT EXISTS usersDb;`;

  const USE_DB_QUERY = "USE messages;";

  const CREATE_TABLE_QUERY = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT UNIQUE,
        cipher_type TEXT,
        encrypted_text TEXT,
        inserted_at DATETIME
      )
    `;

  await sqlConn.query(CREATE_DB_QUERY);
  await sqlConn.query(USE_DB_QUERY);
  await sqlConn.query(CREATE_TABLE_QUERY);

  await sqlConn.end();
}

let conn = null;

export async function getConn() {
  if (conn) return conn;
  else {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306,
      database: "todos",
    });
    return conn;
  }
}