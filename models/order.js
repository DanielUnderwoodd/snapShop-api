var timestamps = require("mongoose-timestamp");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var order = Schema(
  {
    CID: { type: Schema.Types.ObjectId, ref: "Customers", required: true },
    address_id: {
      type: String,
      required: true,
    },
    is_payed: {
      type: Boolean,
      required: true,
    },
    cart: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product_id: {
          type: Number,
          ref: "products",
          required: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

order.virtual("productId", {
  ref: "products",
  localField: "cart.product_id",
  foreignField: "id",
});

order.plugin(timestamps);

var orderModel = mongoose.model("orders", order);

module.exports = orderModel;
