const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.getUserAll);

router.get('/user/:id', userController.getUserById);

router.post('/user', userController.createUser);

router.put('/user/:id', userController.updateUser);

router.delete('/user/:id', userController.deleteUser);

module.exports = router;