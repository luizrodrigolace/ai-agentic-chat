// src/types/chat.ts

// Tipagem base para o objeto de mensagem, esperado pelo backend (AI SDK)
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
};

// Tipagem para o estado do Contexto de Chat
export type ChatContextType = {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (prompt: string) => Promise<void>;
};

// ❌ AuthContextType foi removido