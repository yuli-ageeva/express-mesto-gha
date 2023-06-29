const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/me', userController.updateUserProfile);
router.patch('/me/avatar', userController.updateUserAvatar);

module.exports = router;
