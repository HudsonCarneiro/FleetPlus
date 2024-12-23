const express = require('express');
const addressController = require('../controllers/addressController');

const router = express.Router();

router.get('/address/:id', addressController.getAddressById);

router.post('/address', addressController.createAddress);

router.put('/address/:id', addressController.updateAddress);

router.delete('/address/:id', addressController.deleteAddress);

module.exports = router;