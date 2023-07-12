const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');
const {
  validateUpdateUser,
  validateUpdateAvatar, validateIdUser,
} = require('../utils/userValidator');

router.get('/', userController.getUsers);
router.get('/:userId', validateIdUser, userController.getUserById);
router.get('/me', userController.getUserProfile);
router.patch('/me', validateUpdateUser, userController.updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, userController.updateUserAvatar);

module.exports = router;
