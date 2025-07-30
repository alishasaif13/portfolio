const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  amount: { type: Number },
  status: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
