// src/services/chatService.ts

import { ChatMessage } from '../types/chat';

const API_URL = 'http://localhost:3000/chat'; 

/**
 * Envia as mensagens para a API de chat e retorna a resposta de stream.
 * @param messages - O array de mensagens no formato { role, content }.
 * @returns A resposta 'fetch' bruta para consumo do stream.
 */
export const fetchChatStream = async (messages: ChatMessage[]): Promise<Response> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Envia o array completo de mensagens para manter o contexto
    body: JSON.stringify({ messages }), 
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erro na API: ${response.statusText}`);
  }

  return response;
};