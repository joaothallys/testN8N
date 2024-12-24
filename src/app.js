const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Rotas
app.use('/webhooks', routes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
