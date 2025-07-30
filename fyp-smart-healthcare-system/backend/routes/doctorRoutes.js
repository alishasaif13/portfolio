const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/add', doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.put('/update/:id', doctorController.updateDoctor);
router.delete('/delete/:id', doctorController.deleteDoctor);

module.exports = router;
