const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Rota para acessar o dashboard
router.get('/dashboard', authenticateToken, dashboardController.getDashboard);

module.exports = router;
