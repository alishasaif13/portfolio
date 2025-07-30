const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  medicineName: String,
  quantity: Number,
  customerName: String,
  phone: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
