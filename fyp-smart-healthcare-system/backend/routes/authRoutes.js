app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password }); // default role = 'user'
    await newUser.save();
    res.status(201).json({ message: 'Signup successful. Please login.' });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err });
  }
});
