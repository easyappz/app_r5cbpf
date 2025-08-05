const express = require('express');
const router = express.Router();
const registrationController = require('@src/controllers/registration');
const loginController = require('@src/controllers/login');
const passwordResetController = require('@src/controllers/passwordReset');
const photoController = require('@src/controllers/photo');
const userController = require('@src/controllers/user');
const authMiddleware = require('@src/middlewares/auth');

router.post('/auth/register', registrationController.register);
router.post('/auth/login', loginController.login);
router.post('/auth/reset', passwordResetController.reset);
router.post('/upload', authMiddleware, photoController.upload);
router.get('/photos', authMiddleware, photoController.getPhotos);
router.post('/rate/:photoId', authMiddleware, photoController.rate);
router.get('/myphotos', authMiddleware, userController.getMyPhotos);
router.get('/stats', authMiddleware, userController.getStats);

module.exports = router;
