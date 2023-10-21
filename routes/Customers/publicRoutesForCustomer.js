const express = require("express");
const router = express.Router();
const verifyCodeRegister = require("../../verifyCode/verifyCodeRegister");
const verifyCodeLogIn = require("../../verifyCode/verifyCodeLogin");
const verificationCode = require("../../config/sendVerificationCode");
const { userValidationRules, validate } = require("../../validator/user.js");
const { coderValidationRules } = require("../../validator/coder");
const { codeValidationRules } = require("../../validator/code");

module.exports = (Customers, sessionCustomers, client, jwt, rateLimit) => {
  // send verification code
  router.post(
    "/code",
    coderValidationRules(),
    validate,
    rateLimit,
    (req, res) => {
      let role = "customer";
      verificationCode(req, res, client, Customers, role);
    }
  );

  //register customers
  router.post(
    "/register",
    userValidationRules(),
    codeValidationRules(),
    coderValidationRules(),
    validate,
    async (req, res) => {
      try {
        let findResponse = await Customers.findOne({
          email: req.body.email,
        });
        if (findResponse) {
          res.status(500).json("This email is already in the system");
        } else {
          // try verify access code first
          client.get(req.body.email, (err, reply) => {
            if (err) throw err;
            else if (!reply) {
              res.status(500).json("Code is expired");
            } else if (req.body.code === reply) {
              let role = "customer";
              verifyCodeRegister(
                req,
                res,
                client,
                Customers,
                sessionCustomers,
                jwt,
                role
              );
            } else {
              res.status(500).json("Code is wrong, try again");
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  );

  // login customer
  router.post(
    "/login",
    codeValidationRules(),
    coderValidationRules(),
    validate,
    async (req, res) => {
      try {
        let findResponse = await Customers.findOne({
          email: req.body.email,
        });
        if (findResponse === null) {
          res.status(500).json("This email wasn't found at the system");
        } else {
          // try verify access code first
          client.get(req.body.email, (err, reply) => {
            if (err) throw err;
            else if (!reply) {
              res.status(500).json("Code is expired");
            } else if (req.body.code === reply) {
              let role = "customer";
              verifyCodeLogIn(
                req,
                res,
                client,
                Customers,
                sessionCustomers,
                jwt,
                findResponse,
                role
              );
            } else {
              res.status(500).json("Code is wrong, try again");
            }
          });
        }
      } catch (err) {
        res.status(500).json("Internal Mongodb error");
        console.log(err);
      }
    }
  );

  return router;
};
