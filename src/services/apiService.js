const axios = require('axios');

const processData = async (data) => {
  try {
    // Enviar o JSON completo recebido para outra API
    const response = await axios.post(process.env.API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });

    console.log('Resposta da API externa:', response.data);
    return response;
  } catch (error) {
    console.error('Erro ao enviar dados para a API externa:', error);
    throw error;
  }
};

module.exports = { processData };