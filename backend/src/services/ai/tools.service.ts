// src/services/ai/tools.service.ts
import { tool } from 'ai';
import { z } from 'zod';
import { getWeather } from '../weather.service';
import { getExchangeRate } from '../currency.service';
import { readPdf } from '../pdf.service';


export const weatherTool = tool({
  name: 'weather',
  description: 'Obtém o clima atual para uma cidade específica.',
  inputSchema: z.object({
    city: z.string().describe('Nome da cidade, ex: São Paulo'),
  }),
  execute: async ({ city }: { city: string }) => {
    const weather = await getWeather(city);
    return { weather };
  },
});

export const currencyTool = tool({
  name: 'currency',
  description: 'Obtém a cotação entre duas moedas.',
  inputSchema: z.object({
    base: z.string().describe('Moeda base, ex: USD'),
    target: z.string().describe('Moeda alvo, ex: BRL'),
  }),
  execute: async ({ base, target }: { base: string; target: string }) => {
    const rate = await getExchangeRate(base, target);
    return { rate };
  },
});

export const pdfTool = tool({
  name: 'pdfReader',
  description: 'Lê e extrai o texto de um arquivo PDF no servidor.',
  inputSchema: z.object({
    path: z.string().describe('Caminho completo do arquivo PDF no servidor'),
  }),
  execute: async ({ path }) => {
    const content = await readPdf(path);
    return { content };
  },
});

export const tools = {
  weather: weatherTool,
  currency: currencyTool,
  pdfReader: pdfTool,
};
