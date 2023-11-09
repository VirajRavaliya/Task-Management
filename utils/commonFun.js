const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const APP_SECRET = "task_management";

module.exports.generateSalt = async () => {
  return bcrypt.genSalt();
};

module.exports.generateHashPassword = async (password) => {
  const salt = await this.generateSalt();
  return bcrypt.hashSync(password, salt);
};

module.exports.comparePassword = async (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports.generateToken = async (data) => {
  const token = jwt.sign(data, APP_SECRET, { expiresIn: "3h" });
  return token;
};
