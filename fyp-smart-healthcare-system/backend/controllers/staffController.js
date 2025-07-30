// controllers/staffController.js

const Staff = require("../models/Staff");

// GET all staff
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Error getting staff" });
  }
};

// GET single staff by ID
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff" });
  }
};

// ADD new staff
const createStaff = async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const saved = await newStaff.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to add staff", error: err.message });
  }
};

// UPDATE staff
const updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Staff not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update staff", error: err.message });
  }
};

// DELETE staff
const deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete staff" });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
