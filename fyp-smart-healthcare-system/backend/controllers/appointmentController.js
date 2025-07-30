const Appointment = require("../models/appointmentModel");

const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, doctor, date, time, message } = req.body;
    const newAppointment = new Appointment({ name, email, phone, doctor, date, time, message });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Appointment creation error:", err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};

module.exports = { createAppointment, getAppointments, deleteAppointment };
