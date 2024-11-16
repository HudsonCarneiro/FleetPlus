const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/api/register', authController.register);
router.post('/api/login', authController.login);
router.post('/api/validateToken', authenticateToken, authController.validateToken);

module.exports = router;

