// src/services/currency.service.ts
import axios from 'axios';

export async function getExchangeRate(base: string, target: string) {
  const apiKey = process.env.EXCHANGE_API_KEY;

  if (!apiKey) {
    throw new Error('❌ Missing EXCHANGE_API_KEY in .env');
  }

  console.log('[DEBUG] EXCHANGE_API_KEY:', process.env.EXCHANGE_API_KEY ? '✔️ carregada' : '❌ faltando');

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}`;

  const { data } = await axios.get(url);

  if (data.result !== 'success') {
    throw new Error(`❌ Erro ao buscar taxa de câmbio: ${data['error-type']}`);
  }

  return `1 ${base} = ${data.conversion_rate} ${target}`;
}
