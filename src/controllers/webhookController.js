const { processData } = require('../services/apiService');

const handleWebhook = async (req, res) => {
  try {
    const eventData = req.body;
    // Verifica se o evento existe
    if (!eventData || !eventData.event) {
      console.log('Evento não identificado ou dados ausentes.');
      return res.status(400).json({ error: 'Evento ou dados ausentes' });
    }

    // Exibe o tipo de evento no console
    console.log(`Tipo do evento recebido: ${eventData.event}`);

    // Filtra eventos com "env" igual a "sent"
    if (eventData.event === 'sent') {
      try {
        const response = await processData(eventData);
        console.log('Dados enviados com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao enviar dados para a API externa:', error);
        return res.status(500).json({ error: 'Erro ao enviar dados para a API externa' });
      }
    }

    // Retorna uma resposta de sucesso
    return res.status(200).json({ success: true, message: 'Evento processado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { handleWebhook };