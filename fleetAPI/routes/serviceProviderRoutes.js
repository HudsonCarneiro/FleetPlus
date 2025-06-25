const express = require('express');
const serviceProviderController = require('../controllers/serviceProviderController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/serviceProviders', authenticateToken, serviceProviderController.getAllServiceProviders);

router.get('/serviceProvider/:id', authenticateToken, serviceProviderController.getServiceProviderById);

router.post('/serviceProvider', authenticateToken, serviceProviderController.createServiceProvider);

router.put('/serviceProvider/:id', authenticateToken, serviceProviderController.updateServiceProvider);

router.delete('/serviceProvider/:id', authenticateToken, serviceProviderController.deleteServiceProvider);

module.exports = router;