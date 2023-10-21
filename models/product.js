var timestamps = require("mongoose-timestamp");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var product = Schema({
  id: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// make unique index

product.plugin(timestamps);

var productModel = mongoose.model("products", product);

module.exports = productModel;
