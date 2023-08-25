const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    orderId: { type: String },
    amount: { type: Number },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", PaymentSchema);
