const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rota protegida: o middleware é executado antes do controlador
router.get('/dashboard', authenticateToken, getDashboard);

module.exports = router;
