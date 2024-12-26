import axios from 'axios';

export const processData = async (data) => {
  try {
    const response = await axios.post(process.env.API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Resposta da API externa:', response.data);
    return response;
  } catch (error) {
    console.error('Erro ao enviar dados para a API externa:', error);
    throw error;
  }
};
