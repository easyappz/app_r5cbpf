const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

exports.getMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ owner: req.userId });
    const photosWithStats = photos.map(p => ({ ...p.toObject(), stats: p.getStats() }));
    res.json(photosWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const photos = await Photo.find({ owner: req.userId });
    const totalRatings = photos.reduce((acc, p) => acc + p.ratings.length, 0);
    const totalScore = photos.reduce((acc, p) => acc + p.ratings.reduce((s, r) => s + r.score, 0), 0);
    const avgRating = totalRatings > 0 ? totalScore / totalRatings : 0;
    res.json({ balance: user.balance, totalPhotos: photos.length, totalRatings, avgRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
