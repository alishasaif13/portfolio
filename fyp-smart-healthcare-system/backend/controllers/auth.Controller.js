// backend/controllers/auth.controller.js

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // Dummy admin login
  if (username === "admin" && password === "admin123") {
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

exports.signup = (req, res) => {
  const { username, password } = req.body;

  // This is just a placeholder
  res.status(201).json({ success: true, message: "Signup successful (not implemented)" });
};
