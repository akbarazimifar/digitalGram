const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const conn = mysql.createConnection(process.env.DATABASE_URL);

const isUserExists = async (username, email) => {
  const res = conn
    .promise()
    .query("SELECT * FROM users WHERE username = ? OR email = ? ", [
      username,
      username,
    ])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return false;
      }
    });
  return res;
};

const hashPassword = async (password) => {
  const salt = 12;
  return bcrypt.hashSync(password, salt);
};

const createUser = async (email, username, password) => {
  const UUID = uuidv4();
  conn.execute(
    "INSERT INTO users (email,username,password,userID) VALUES (?,?,?,?)",
    [email, username, password, UUID]
  );
};

module.exports = { hashPassword, createUser, isUserExists };