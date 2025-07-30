const Feedback = require('../models/feedbackModel');

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { patientName, feedbackText, rating } = req.body;

    const feedback = new Feedback({ patientName, feedbackText, rating });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
