const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, min: 1, max: 10 }
});

const photoSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true }, // base64
  ratings: [ratingSchema],
  createdAt: { type: Date, default: Date.now }
});

photoSchema.methods.getStats = function() {
  if (this.ratings.length === 0) return { count: 0, average: 0 };
  const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
  return { count: this.ratings.length, average: sum / this.ratings.length };
};

module.exports = mongoose.model('Photo', photoSchema);
