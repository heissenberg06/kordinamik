const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateLogin, handleValidationErrors } = require('../utils/validation.utils');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login admin and get tokens
 * @access Public
 */
router.post('/login', validateLogin, handleValidationErrors, authController.login);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token using refresh token
 * @access Public (requires refresh token cookie)
 */
router.post('/refresh', authController.refresh);

/**
 * @route POST /api/auth/logout
 * @desc Logout admin and invalidate tokens
 * @access Private
 */
router.post('/logout', authenticateAdmin, authController.logout);

module.exports = router;


