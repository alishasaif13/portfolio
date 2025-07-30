const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.get('/', getAppointments);
router.post('/', createAppointment);
router.delete('/:id', deleteAppointment);

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
