const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: String,
  stock: Number,
  expiry: Date,
  category: String,
  manufacturer: String,
  price: Number,
});

module.exports = mongoose.model('Medicine', pharmacySchema);

