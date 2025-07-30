const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  expiry: String,
  price: Number,
});

module.exports = mongoose.model("Medicine", medicineSchema);
