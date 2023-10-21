const express = require("express");
const router = express.Router();

const { userValidationRules, validate } = require("../../validator/user.js");
const { addAddressValidationRules } = require("../../validator/addAddress");

module.exports = (Admin, sessionAdmin, client, jwt) => {
  router.get("/logout", async (req, res) => {});

  return router;
};
