import PQueue from 'p-queue';
import { processData } from '../services/apiService.js';

const queue = new PQueue({ concurrency: 1 });

export const handleWebhook = async (req, res) => {
  try {
    console.log('Corpo da solicitação:', JSON.stringify(req.body, null, 2)); // Adiciona log do corpo da solicitação
    const eventData = req.body;
    if (!eventData || !eventData.event) {
      return res.status(400).json({ error: 'Evento ou dados ausentes' });
    }

    // Verifica se o evento deve ser processado
    const author = eventData.value?.author;
    const authorUuid = author?.uuid;

    if (eventData.event === 'sent' && !authorUuid) {
      queue.add(() => processEvent(eventData));
      console.log(`Evento enfileirado do contato: ${eventData.value.metadata['deprecated_contact_id']}`);
      return res.status(200).json({ success: true, message: 'Evento enfileirado com sucesso' });
    } else {
      console.log(`Evento do contact_id não processado: ${eventData.value.metadata['deprecated_contact_id']}`);
      return res.status(200).json({ success: false, message: 'Evento não processado' });
    }
  } catch (error) {
    console.error('Erro ao enfileirar webhook:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função para processar eventos
const processEvent = async (eventData) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      console.log(`Tentativa ${attempts + 1} de processar o evento: ${eventData.value.metadata['deprecated_contact_id']}`);
      console.log('Dados sendo enviados para a API:', JSON.stringify(eventData, null, 2)); // Adiciona log dos dados sendo enviados para a API
      const response = await processData(eventData);
      console.log('Dados enviados com sucesso:', response.data);
      return; // Sai do loop ao processar com sucesso
    } catch (error) {
      attempts++;
      console.error(`Erro ao processar o evento: ${error.message}`);

      if (attempts < maxAttempts) {
        console.log(`Aguardando 30 segundos antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      } else {
        console.error(`Falha após ${maxAttempts} tentativas. Evento: ${eventData.event}`);
        throw new Error(`Evento falhou após ${maxAttempts} tentativas`);
      }
    }
  }
};