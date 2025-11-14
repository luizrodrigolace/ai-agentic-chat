// src/context/ChatContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchChatStream } from '../services/chatService';
import { ChatMessage, ChatContextType } from '../types/chat';

// 1. Criação do Contexto (Tipado)
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 2. Hook Customizado para consumo (Hook Propless)
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};

// 3. Tipagem para as Props do Provider
interface ChatProviderProps {
    children: ReactNode;
}

// 4. Provider que gerencia o estado e as ações
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    // 1. Adiciona a mensagem do usuário à lista
    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const contextMessages = [...messages, userMessage]; // Contexto para a chamada
    setMessages(contextMessages);
    setIsLoading(true);

    // 2. Adiciona um placeholder para a resposta do assistente
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      // 3. Chama o serviço de API
      const response = await fetchChatStream(contextMessages); 
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      // 4. Lê o stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        receivedText += chunk;
        
        // 5. Atualiza a última mensagem (o placeholder do assistente)
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = receivedText;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Erro ao processar streaming:', error);
      // Trata o erro na UI
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = `❌ Erro: ${error instanceof Error ? error.message : "Falha desconhecida."}`;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const value: ChatContextType = {
    messages,
    isLoading,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};