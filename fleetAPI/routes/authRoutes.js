const express = require('express');
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/api/login',
  [
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  authController.login
);