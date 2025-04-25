const express = require('express');
const router = express.Router();
const { chatWithOllama } = require('../controllers/chatController');

router.post('/chat', chatWithOllama);

module.exports = router; 