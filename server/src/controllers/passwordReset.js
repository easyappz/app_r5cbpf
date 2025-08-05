const User = require('@src/models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const SECRET = 'secretkey123';

exports.reset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'example@gmail.com', // Replace with your email
        pass: 'examplepass' // Replace with your password
      }
    });
    const mailOptions = {
      from: 'example@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:3000/reset?token=${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
