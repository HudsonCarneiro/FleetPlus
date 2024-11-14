const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/get/users', userController.getUserAll);

router.get('/get/user/:id', userController.getUserById);

router.post('/post/user', userController.createUser);

router.post('/login/user', userController.loginUser);

router.put('/put/user/:id', userController.updateUser);

router.delete('/delete/user/:id', userController.deleteUser);

module.exports = router;