const express = require("express");
const router = express.Router();
const verificationCode = require("../../config/sendVerificationCode");
const verifyCodeLogIn = require("../../verifyCode/verifyCodeLogin");
const verifyCodeRegister = require("../../verifyCode/verifyCodeRegister");
const { userValidationRules, validate } = require("../../validator/user.js");
const { coderValidationRules } = require("../../validator/coder");
const { codeValidationRules } = require("../../validator/code");

module.exports = (Admin, sessionAdmin, client, jwt, rateLimit) => {
  // send verfirication code
  router.post(
    "/code",
    coderValidationRules(),
    validate,
    rateLimit,
    async (req, res) => {
      let findResponseAdmin = await Admin.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (findResponseAdmin) {
        let role = "admin";

        verificationCode(req, res, client, Admin, role);
      } else {
        res.status(500).json("این شماره در سامانه موجود نمی باشد");
      }
    }
  );

  router.post(
    "/register",
    userValidationRules(),
    codeValidationRules(),
    coderValidationRules(),
    validate,
    async (req, res) => {
      try {
        let findResponse = await Admin.findOne({
          phoneNumber: req.body.phoneNumber,
        });
        if (findResponse) {
          res.status(500).json("این شماره در سامانه موجود می باشد");
        } else {
          // try verify access code first
          client.get(req.body.phoneNumber, (err, reply) => {
            if (err) throw err;
            else if (!reply) {
              res.status(500).json("کد منقضی شده است");
            } else if (req.body.code === reply) {
              let role = "admin";
              verifyCodeRegister(
                req,
                res,
                client,
                Admin,
                sessionAdmin,
                jwt,
                role
              );
            } else {
              res.status(500).json("کد اشتباه است مجددا تلاش کنید");
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  );

  router.post(
    "/login",
    codeValidationRules(),
    coderValidationRules(),
    validate,
    async (req, res) => {
      try {
        let findResponse = await Admin.findOne({
          phoneNumber: req.body.phoneNumber,
        });
        if (findResponse === null) {
          res.status(403).json("چنین شماره ای در سامانه یاف نشد");
        } else {
          // try verify access code first
          client.get(req.body.phoneNumber, (err, reply) => {
            if (err) throw err;
            else if (!reply) {
              res.status(500).json("کد منقضی شده است");
            } else if (req.body.code === reply) {
              let role = "admin";
              verifyCodeLogIn(
                req,
                res,
                client,
                Admin,
                sessionAdmin,
                jwt,
                findResponse,
                role
              );
            } else {
              res.status(500).json("کد اشتباه است مجددا تلاش کنید");
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
