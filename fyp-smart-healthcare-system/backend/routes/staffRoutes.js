const express = require('express');
const router = express.Router();
const Staff = require('../models/staffModel'); // adjust path if needed

// CREATE staff
router.post('/', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all staff
router.get('/', async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one staff
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE staff
router.put('/:id', async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
