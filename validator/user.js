const { body, validationResult } = require("express-validator");
const userValidationRules = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("Enter your first name")
      .matches(/^[A-Za-z ][A-Za-z ]+$/i)
      .withMessage("first name: Usa a correct form"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Enter a phone number")
      .isLength({ min: 9, max: 9 })
      .withMessage("Enter your phone Number without zero"),
    body("lastName")
      .notEmpty()
      .withMessage("Enter your last name")
      .matches(/^[A-Za-z][A-Za-z ]+$/i)
      .withMessage("last name: Use a correct form"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = {};
  errors
    .array({ onlyFirstError: true })
    .map((err) => (extractedErrors[err.param] = err.msg));

  return res.status(403).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};
