const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicineModel");

router.post("/add", async (req, res) => {
  const { name, quantity, expiry, price } = req.body;

  if (!name || quantity == null || !expiry || price == null)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newMed = new Medicine({ name, quantity, expiry, price });
    await newMed.save();
    res.status(200).json({ message: "Medicine added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add medicine" });
  }
});

router.get("/stock", async (req, res) => {
  try {
    const stock = await Medicine.find();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock" });
  }
});

module.exports = router;
