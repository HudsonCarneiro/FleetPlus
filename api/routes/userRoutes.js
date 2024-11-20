const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/user', userController.createUser);

router.post('/user/login', userController.login);

router.put('/user/:id', userController.updateUser);

router.delete('/user/:id', userController.deleteUser);

module.exports = router;