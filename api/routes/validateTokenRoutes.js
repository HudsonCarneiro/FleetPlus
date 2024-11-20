const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/validateToken', authenticateToken, (req, res) => {
    res.status(200).json({ success: true, message: 'Token válido.' });
});

module.exports = router;
