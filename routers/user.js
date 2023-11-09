const router = require("express").Router();
const userAuth = require("../middlewares/auth");
const userController = require("../controllers/user_controller");
const taskController = require("../controllers/task_controller");
const {
  signUpVAL,
  loginVAL,
  taskVal,
  Validation,
} = require("../middlewares/validations/user");

//User
router.post("/signup", signUpVAL, Validation, userController.signUp);
router.post("/logIn", loginVAL, Validation, userController.logIn);

//task
router.get("/get-task-list", userAuth, taskController.getTaskList);
router.post("/add-task", userAuth, loginVAL, Validation, taskController.addTask);
router.post("/update-task", userAuth, taskVal, Validation, taskController.updateTask);
router.post("/delete-task", userAuth, taskVal, Validation, taskController.deleteTask);

module.exports = router;