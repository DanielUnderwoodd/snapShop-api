const rateLimit = require('express-rate-limit')


const createAccountLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 1, // start blocking after 1 requests
    message:
      "Too many request to send verfirication code"
  });


  module.exports = createAccountLimiter