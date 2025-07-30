const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  doctor: String,
  date: String,
  time: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
