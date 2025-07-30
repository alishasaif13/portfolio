const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  contact: String,
  role: String
});

module.exports = mongoose.model('Staff', staffSchema);
