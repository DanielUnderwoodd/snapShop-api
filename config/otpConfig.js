const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "2b8e63be",
  apiSecret: "fC7dIEI6VCboCByh",
});

module.exports = { vonage };
