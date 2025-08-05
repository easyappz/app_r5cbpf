const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

exports.upload = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    const buffer = Buffer.from(image, 'base64');
    if (buffer.length > 1024 * 1024) return res.status(400).json({ error: 'Image too large, max 1MB' });
    const photo = new Photo({ owner: req.userId, image });
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const filters = {};
    if (gender) filters.gender = gender;
    if (minAge || maxAge) filters.age = {};
    if (minAge) filters.age.$gte = parseInt(minAge);
    if (maxAge) filters.age.$lte = parseInt(maxAge);
    const users = await User.find(filters).select('_id');
    const userIds = users.map(u => u._id);
    const photos = await Photo.find({
      owner: { $in: userIds, $ne: req.userId },
      'ratings.userId': { $ne: req.userId }
    });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rate = async (req, res) => {
  try {
    const { score } = req.body;
    const photoId = req.params.photoId;
    if (!score || score < 1 || score > 10) return res.status(400).json({ error: 'Invalid score' });
    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    if (photo.owner.toString() === req.userId) return res.status(400).json({ error: 'Cannot rate own photo' });
    if (photo.ratings.some(r => r.userId.toString() === req.userId)) return res.status(400).json({ error: 'Already rated' });
    const rater = await User.findById(req.userId);
    if (rater.balance < 1) return res.status(400).json({ error: 'Insufficient balance' });
    rater.balance -= 1;
    await rater.save();
    const owner = await User.findById(photo.owner);
    owner.balance += 1;
    await owner.save();
    photo.ratings.push({ userId: req.userId, score });
    await photo.save();
    res.json({ message: 'Rated successfully', stats: photo.getStats() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
