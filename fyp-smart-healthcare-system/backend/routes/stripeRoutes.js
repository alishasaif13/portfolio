const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51RfCYj4CO1JgncfVesHi1WwQuMTCaMQGb2fSc3pDE4Mulr13AHeDBix3JMrlFQzm9YuCJnTegAqkcM06M3Qqwaxz00fXwNKgY1");

router.post("/create-payment", async (req, res) => {
  try {
    const { amount, email } = req.body;
    console.log("📩 Incoming payment request:", req.body);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: email,
    });

    console.log("✅ Client secret:", paymentIntent.client_secret);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("🔥 Stripe full error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const Payment = require("../models/paymentModel"); // 🔁 already imported in controller

// ✅ Route: Save payment info to DB after success
router.post("/save", async (req, res) => {
  try {
    const { name, email, amount, status } = req.body;

    if (!name || !email || !amount || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPayment = new Payment({
      name,
      email,
      amount,
      status,
      createdAt: new Date()
    });

    await newPayment.save();
    res.status(200).json({ message: "Payment saved successfully" });
  } catch (err) {
    console.error("❌ Error saving payment:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
});

// ✅ Route: Get all payments
router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;
