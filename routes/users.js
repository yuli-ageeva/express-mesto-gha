const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.get('/me', userController.getUserProfile);
router.patch('/me', userController.updateUserProfile);
router.patch('/me/avatar', userController.updateUserAvatar);

module.exports = router;
