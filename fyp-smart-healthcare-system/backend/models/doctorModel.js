const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  specialization: { type: String, required: true },
  email: String,
  phone: String
});

module.exports = mongoose.model('Doctor', doctorSchema);
