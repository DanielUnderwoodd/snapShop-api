const { body } = require("express-validator");
const addAddressValidationRules = () => {
  return [
    body("phoneNumber")
      .notEmpty()
      .withMessage("Enter your phone Number without zero")
      .isLength({ min: 9, max: 9 })
      .withMessage("Only finnish phone number is allowed"),
    body("location").notEmpty().withMessage("Enter Your address"),
  ];
};

module.exports = {
  addAddressValidationRules,
};
