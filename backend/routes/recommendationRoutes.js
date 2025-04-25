const express = require('express');
const router = express.Router();
const { generateRecommendations } = require('../controllers/recommendationController');

// POST route for generating recommendations
router.post('/', generateRecommendations);

module.exports = router; 