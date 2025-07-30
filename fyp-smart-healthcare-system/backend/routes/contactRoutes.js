const express = require("express");
const router = express.Router();
const { createContact, getAllContacts } = require("../controllers/contactController");

router.post("/contact", createContact);
router.get("/contacts", getAllContacts);

module.exports = router;
