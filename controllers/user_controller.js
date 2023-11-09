const db = require("../models/index");
const _ = require("lodash");

const {
  generateHashPassword,
  comparePassword,
  generateToken,
} = require("../utils/commonFun");
const { createLogFile } = require("../utils/createLogs");

const userModel = db.users;

module.exports.signUp = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { email, password, first_name, last_name } = req?.body;

    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    if (!isEmail) {
      await t.rollback();
      return res.json({
        status: false,
        message: "Please provide valid email.",
        code: 200,
      });
    }
    const findUser = await userModel.findOne({
      where: { email: email },
      raw: true,
      attributes: ["id"],
    });

    if (!findUser) {
      const pass = await generateHashPassword(password);
      const data = { email, first_name, last_name, password: pass };

      const addUser = await userModel
        .create(data, { transaction: t })
        .then(async () => {
          await t.commit();
          return {
            status: true,
            message: "User added successfully.",
            code: 200,
          };
        })
        .catch(async (error) => {
          await t.rollback();
          return res.json({
            status: false,
            message: error.message,
            code: 200,
          });
        });

      return res.json(addUser);
    } else {
      await t.rollback();
      return res.json({
        status: false,
        message: "User is already exist.",
        code: 200,
      });
    }
  } catch (error) {
    createLogFile(
      "signUp",
      error,
      error?.stack,
      "user_controller",
      "controllers"
    );
    await t.rollback();
    return res.json({
      status: false,
      message: error.message,
      code: 500,
    });
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req?.body;

    const findUser = await userModel.findOne({
      where: { email: email },
      raw: true,
      attributes: ["id", "password", "email"],
    });

    if (!findUser) {
      return res.json({
        status: false,
        message: "User not found.",
        code: 200,
      });
    }

    const checkPassword = await comparePassword(password, findUser?.password);
    if (!checkPassword) {
      return res.json({
        status: false,
        message: "Invalid password.",
        code: 200,
      });
    }

    const token = await generateToken({ user_id: findUser?.id });
    return res.json({
      status: true,
      message: "User added successfully.",
      code: 200,
      data: { token: token },
    });
  } catch (error) {
    createLogFile(
      "logIn",
      error,
      error?.stack,
      "user_controller",
      "controllers"
    );
    return res.json({
      status: false,
      message: error?.message,
      code: 500,
    });
  }
};
