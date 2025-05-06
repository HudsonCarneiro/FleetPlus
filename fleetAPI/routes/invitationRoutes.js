const express = require('express');
const invitationController = require('../controllers/invitationController');

const router = express.Router();

// Criar um novo convite
router.post('/invitation', invitationController.createInvitation);

// Validar token de convite
router.get('/invitation/validate/:token', invitationController.validateToken);

// Aceitar convite
router.post('/invitation/accept', invitationController.acceptInvitation);

module.exports = router;
