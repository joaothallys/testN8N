const express = require('express');
const router = express.Router();
const { handleWebhook } = require('./controllers/webhookController');

// Rota para receber os eventos do webhook
router.post('/', handleWebhook);

module.exports = router;
