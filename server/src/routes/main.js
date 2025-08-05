const express = require('express');
const router = express.Router();
const authController = require('@src/controllers/auth');
const photoController = require('@src/controllers/photo');
const userController = require('@src/controllers/user');
const authMiddleware = require('@src/middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload', authMiddleware, photoController.upload);
router.get('/photos', authMiddleware, photoController.getPhotos);
router.post('/rate/:photoId', authMiddleware, photoController.rate);
router.get('/myphotos', authMiddleware, userController.getMyPhotos);
router.get('/stats', authMiddleware, userController.getStats);

module.exports = router;
