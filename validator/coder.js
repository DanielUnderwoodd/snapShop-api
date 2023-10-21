const { body } = require("express-validator");
const coderValidationRules = () => {
  return [body("email").isEmail().withMessage("Enter Valid email address")];
};

module.exports = {
  coderValidationRules,
};
