// src/services/chatService.ts

import { ChatMessage } from '../types/chat';

const API_URL = 'http://localhost:3000'; // URL base do backend

/**
 * Envia as mensagens para a API de chat e retorna a resposta de stream.
 */
export const fetchChatStream = async (messages: ChatMessage[]): Promise<Response> => {
  const response = await fetch(`${API_URL}/chat`, { // Usa a URL base
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }), 
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erro na API: ${response.statusText}`);
  }
  return response;
};

/**
 * * ⚠️ NOVO: Envia um arquivo PDF para o backend.
 * @param file - O arquivo PDF a ser enviado.
 * @returns O JSON de resposta do servidor (ex: { success: true, filePath: '...' }).
 */
export const uploadPdfApi = async (file: File): Promise<{ filePath: string }> => {
  const formData = new FormData();
  // O nome 'pdf' deve bater com o middleware do multer: uploadMiddleware.single('pdf')
  formData.append('pdf', file); 

  const response = await fetch(`${API_URL}/upload-pdf`, {
    method: 'POST',
    body: formData,
    // Não defina 'Content-Type', o 'fetch' faz isso automaticamente para 'multipart/form-data'
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Falha ao enviar o PDF.');
  }

  return result;
};