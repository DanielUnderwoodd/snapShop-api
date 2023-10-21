var timestamps = require("mongoose-timestamp");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Admin = Schema({
  UID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  session: [{ type: Schema.Types.String, ref: "sessionAdmins" }],
  role: {
    type: String,
    default: "Admin",
  },
});
// make unique index

Admin.plugin(timestamps);

var adminModel = mongoose.model("Admin", Admin);

module.exports = adminModel;
