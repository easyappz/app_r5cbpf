const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10
  },
  gender: {
    type: String
  },
  age: {
    type: Number
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema);
