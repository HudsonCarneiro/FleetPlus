const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rota para validar o token e retornar informações do usuário
router.post('/validateToken', authenticateToken, (req, res) => {
    const user = req.user; // O middleware `authenticateToken` já define `req.user` com os dados do usuário
    res.status(200).json({ 
        success: true, 
        message: 'Token válido.',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = router;
