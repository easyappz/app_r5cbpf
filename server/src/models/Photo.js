const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageBase64: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const size = Buffer.byteLength(value, 'utf8') / (1024 * 1024);
        return size <= 1;
      },
      message: 'Image size should not exceed 1MB'
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  stats: {
    gender: {
      type: Map,
      of: Number,
      default: {}
    },
    age: {
      type: Map,
      of: Number,
      default: {}
    }
  }
});

module.exports = mongoose.model('Photo', photoSchema);
