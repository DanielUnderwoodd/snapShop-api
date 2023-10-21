var timestamps = require("mongoose-timestamp");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Customers = Schema({
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
  session: [{ type: Schema.Types.String, ref: "sessionCustomers" }],
  address: [
    {
      _id: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  ],
  balance: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "Customer",
  },
  // status: {
  //   type: String,
  //   default: "diactive",
  // },
});
// make unique index

Customers.plugin(timestamps);

var CustomersModel = mongoose.model("Customers", Customers);

module.exports = CustomersModel;
