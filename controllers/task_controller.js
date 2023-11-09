const db = require("../models/index");
const _ = require("lodash");
const { col } = require("sequelize");

const userModel = db.users;
const taskModel = db.users_task;

module.exports.getTaskList = async (req, res) => {
  try {
    const { user_id } = req?.user;

    const getList = await taskModel.findOne({
      where: { user_id: user_id },
      raw: true,
      include: {
        model: userModel,
        as: "userData",
        attributes: [],
      },
      attributes: [
        "id",
        "title",
        "description",
        [col("userData.first_name"), "first_name"],
        [col("userData.last_name"), "last_name"],
      ],
    });

    return res.json(getList);
  } catch (error) {
    createLogFile(
      "getTaskList",
      error,
      error?.stack,
      "task_controller",
      "controllers"
    );
    return res.json({
      status: false,
      message: error.message,
      code: 500,
    });
  }
};

module.exports.addTask = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { user_id } = req?.user;
    const { title, description } = req?.body;

    const data = { user_id, title, description, status: "in_progress" };

    const addUser = await taskModel
      .create(data, { transaction: t })
      .then(async () => {
        await t.commit();
        return {
          status: true,
          message: "User task added successfully.",
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
  } catch (error) {
    await t.rollback();
    createLogFile(
      "updateTask",
      error,
      error?.stack,
      "task_controller",
      "controllers"
    );
    return res.json({
      status: false,
      message: error.message,
      code: 500,
    });
  }
};

module.exports.updateTask = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { status, title, description, task_id } = req?.body;

    const data = {
      status,
      title,
      description,
    };

    const updateUser = await taskModel
      .update(data, { where: { id: task_id } }, { transaction: t })
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
    return res.json(updateUser);
  } catch (error) {
    createLogFile(
      "updateTask",
      error,
      error?.stack,
      "task_controller",
      "controllers"
    );
    await t.rollback();
    return res.json({
      status: false,
      message: error?.message,
      code: 500,
    });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { task_id } = req?.body;

    const findTask = await taskModel.findOne({
      where: { id: task_id },
      raw: true,
      attributes: ["id"],
    });

    if (!findTask) {
      const deleteTask = await taskModel
        .destroy({ where: { id: findUser?.id } })
        .then(async () => {
          return {
            status: true,
            message: "User added successfully.",
            code: 200,
          };
        })
        .catch(async (error) => {
          return {
            status: false,
            message: error.message,
            code: 200,
          };
        });
      return res.json(deleteTask);
    } else {
      return res.json({
        status: false,
        message: "Task not found",
        code: 200,
      });
    }
  } catch (error) {
    createLogFile(
      "deleteTask",
      error,
      error?.stack,
      "task_controller",
      "controllers"
    );
    return res.json({
      status: false,
      message: error?.message,
      code: 500,
    });
  }
};
