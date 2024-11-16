const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Rota protegida para o dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Bem-vindo ao dashboard!', userId: req.userId });
});
// Rota perfil
router.get('/profile', authenticateToken, (req, res) => {
    const userProfile = getUserProfile(req.userId); 
    res.status(200).json(userProfile);
});


module.exports = router;
