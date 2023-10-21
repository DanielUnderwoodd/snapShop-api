const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  auth: {
    user: "drainbow766@gmail.com",
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

var message = {
  from: "noreply@snapgroup.com",
  subject: "verifivation code",
};

module.exports = {
  transporter,
  message,
};
