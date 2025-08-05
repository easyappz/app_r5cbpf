const User = require('@src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = 'secretkey123';

exports.register = async (req, res) => {
  try {
    const { email, password, gender, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, gender, age });
    await user.save();
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
