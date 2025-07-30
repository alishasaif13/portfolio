const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  contact: String,
});

module.exports = mongoose.model("Patient", patientSchema);
