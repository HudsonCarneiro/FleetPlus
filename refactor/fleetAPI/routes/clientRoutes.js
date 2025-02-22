const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.get('/clients', clientController.getClientAll);

router.get('/client/:id', clientController.getClientById);

router.post('/client', clientController.createClient);

router.put('/client/:id', clientController.updateClient);

router.delete('/client/:id', clientController.deleteClient);

module.exports = router;