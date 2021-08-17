const express = require('express');
const stockRoutes = require('./stock.route');
const PortfolioRoutes = require('./portfolio.route');
const NotificationRoutes = require('./notification.route');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

/**
 * GET v1/stocks
 */
router.use('/stocks', stockRoutes);

/**
 * GET v1/portfolio
 */
router.use('/portfolio', PortfolioRoutes);

/**
 * GET v1/notifications
 */
router.use('/notifications', NotificationRoutes);

/**
 * GET v1/users
 */
router.use('/users', userRoutes);

/**
 * GET v1/auth
 */
router.use('/auth', authRoutes);

/*global module*/
/*eslint no-undef: ["error", { "typeof": true }] */
module.exports = router;