const { body } = require("express-validator");
const orderValidationRules = () => {
  return [
    body("address_id")
      .notEmpty()
      .withMessage("Choose your address")
      .matches(/^[ \u0600-\u06FF A-Za-z0-9 ][ \u0600-\u06FF A-Za-z0-9 ]+$/i)
      .withMessage("Usa a correct form"),
    body("is_payed").isBoolean().withMessage("Must be boolean"),
    body("cart").isArray().withMessage("Must be an array"),
  ];
};
module.exports = {
  orderValidationRules,
};
