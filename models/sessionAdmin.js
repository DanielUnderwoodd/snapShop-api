var timestamps = require("mongoose-timestamp");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sessionAdmin = Schema({
  _id: {
    type: String,
    required: true,
  },
  UID: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

// make unique index

sessionAdmin.plugin(timestamps);

sessionAdmin.index(
  { platform: 1, os: 1, ipAddress: 1, version: 1, browser: 1 },
  { unique: true }
);

var sessionAdminModel = mongoose.model("sessionAdmins", sessionAdmin);

module.exports = sessionAdminModel;
