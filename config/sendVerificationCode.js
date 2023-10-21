const randomInt = require("random-int");
const nodemailer = require("../config/nodeMailer");
const { vonage } = require("./otpConfig");

const verificationCode = async (req, res, client, Model, role) => {
  const { email } = req.body;
  const randomNum = randomInt(10000, 100000);

  const text = "Your verification code is:" + randomNum;

  try {
    var message = nodemailer.message;
    message.to = email;
    message.text = text;
    let status = "1";

    const info = await nodemailer.transporter.sendMail(message);
    if (info) {
      status = "0";
      console.log(randomNum);
    }

    if (status === "0") {
      client.setex(email, 600, randomNum, async () => {
        try {
          switch (role) {
            case "customer":
              let status = {};

              let findResponseCustomer = await Model.findOne({
                email,
              });
              if (findResponseCustomer) {
                status.isRegistered = true;
                res.status(200).json(status);
              } else {
                status.isRegistered = false;
                res.status(200).json(status);
              }
              break;
            case "admin":
              let findResponseAdmin = await Model.findOne({
                email: req.body.email,
              });
              if (findResponseAdmin) {
                var message = nodemailer.message;
                message.to = findResponseAdmin.email;
                message.text = ` : ${verification.code} your code`;

                nodemailer.transporter.sendMail(message, (error, info) => {
                  if (error) {
                    res.status(500).json(error);
                  } else {
                    res
                      .status(200)
                      .json(
                        "verification code has been sent successfully through with sms and email"
                      );
                  }
                });
              } else {
                res
                  .status(200)
                  .json("verification code has been sent successfully");
              }
          }
        } catch (err) {
          res.status(400).json(err);
        }
      });
    } else {
      res.status(500).json("can not fullfill the request");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = verificationCode;
