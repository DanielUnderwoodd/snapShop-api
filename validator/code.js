const { body, validationResult } = require("express-validator");
const codeValidationRules = () => {
  return [
    body("code")
      .notEmpty()
      .withMessage("Enter your verification code")
      .isLength({ min: 5, max: 5 })
      .withMessage("code must be in 5 digit range"),
  ];
};

module.exports = {
  codeValidationRules,
};
