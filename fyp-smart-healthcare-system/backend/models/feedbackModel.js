const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  feedbackText: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
