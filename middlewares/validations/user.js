const { check, validationResult } = require("express-validator");

exports.signUpVAL = [
  check("email").trim().not().isEmpty().withMessage("Email must be required"),
  check("password").trim().not().isEmpty().withMessage('Password is required.'),
  check("first_name").trim().not().isEmpty().withMessage('First Name is required.'),
  check("last_name").trim().not().isEmpty().withMessage('Last name is required.'),
];

exports.loginVAL = [
  check("email").trim().not().isEmpty().withMessage("Email or Mobile number must be required"),
  check("password").trim().not().isEmpty().withMessage("Password is required"),
];

exports.taskVal = [
  check("task_id").not().isEmpty().withMessage(" Task id must be required.")
  .isInt().withMessage("task id should be integer."),
];

exports.addTaskVal = [
  check("title").trim().not().isEmpty().withMessage("Title number must be required"),
];

exports.Validation = (req, res, next) => {
  let error = [];
  const result = validationResult(req).array();
  if (!result.length) return next();

  result.map(async (res, index) => {
    error.push(res.msg);
  });

  return res.json({
    status: false,
    message: error.join(", "),
    data: {},
    code: 200,
  });
};
