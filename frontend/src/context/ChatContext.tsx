// src/context/ChatContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
// ⚠️ ATUALIZE A IMPORTAÇÃO
import { fetchChatStream, uploadPdfApi } from '../services/chatService';
import { ChatMessage, ChatContextType } from '../types/chat';

// ... (ChatContext e useChat permanecem os mesmos)
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ... (função sendMessage permanece a mesma)
  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const contextMessages = [...messages, userMessage]; 
    setMessages(contextMessages);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetchChatStream(contextMessages); 
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        receivedText += chunk;
        
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = receivedText;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Erro ao processar streaming:', error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = `❌ Erro: ${error instanceof Error ? error.message : "Falha desconhecida."}`;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  /**
   * ⚠️ NOVO: Função de fluxo de upload de PDF
   */
  const uploadAndAskPdf = useCallback(async (file: File) => {
    if (isLoading) return;

    setIsLoading(true);
    
    // 1. Mensagem de "Enviando PDF..."
    const uploadMessage: ChatMessage = { role: 'user', content: `Enviando PDF: ${file.name}...` };
    setMessages((prev) => [...prev, uploadMessage]);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]); // Placeholder

    try {
      // 2. Faz o upload do arquivo
      const uploadResult = await uploadPdfApi(file);
      const serverFilePath = uploadResult.filePath;
      
      // 3. Atualiza a mensagem do usuário (opcional, mas bom)
      setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 2].content = `PDF "${file.name}" enviado. Qual a sua pergunta sobre ele?`;
          return updated;
      });

      // 4. Envia a mensagem para o agente com o caminho do arquivo
      // Usamos uma pergunta padrão aqui.
      const prompt = `O arquivo PDF está localizado em: ${serverFilePath}. Por favor, faça um breve resumo do conteúdo deste arquivo.`;
      
      // 5. Reutiliza a lógica de streaming para a pergunta
      // Precisamos passar o contexto atualizado para o sendMessage
      const contextMessages = [...messages, uploadMessage];
      await sendMessage(prompt);

    } catch (error) {
      console.error('Erro no fluxo de upload:', error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = `❌ Erro ao enviar PDF: ${error instanceof Error ? error.message : "Falha."}`;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
    // Ajuste: sendMessage já é 'useCallback', mas o contexto dele (messages) está obsoleto
    // Vamos chamar o sendMessage com a mensagem de upload já incluída no array 'messages'
    // A implementação acima está um pouco complexa, vamos simplificar.
  }, [messages, isLoading, sendMessage]); // Adiciona sendMessage à dependência

  /*
   * ⚠️ CORREÇÃO NO FLUXO DE UPLOAD (Versão mais simples)
   * A versão acima tem um bug de estado (chamar sendMessage com 'messages' obsoleto).
   * Vamos refatorar 'uploadAndAskPdf' para ser mais simples e direto.
   */
  const uploadAndAskPdf_Refatorado = useCallback(async (file: File) => {
    if (isLoading) return;

    setIsLoading(true);

    // 1. Mensagem de "Enviando PDF..."
    const uploadUserMessage: ChatMessage = { role: 'user', content: `Enviando PDF: ${file.name}...` };
    setMessages((prev) => [...prev, uploadUserMessage]);
    
    // 2. Tenta fazer o upload
    try {
      const uploadResult = await uploadPdfApi(file);
      const serverFilePath = uploadResult.filePath;
      
      // 3. Pergunta padrão sobre o PDF
      const prompt = `O arquivo PDF está localizado em: ${serverFilePath}. Por favor, faça um breve resumo do conteúdo deste arquivo.`;
      
      // 4. ATUALIZA a mensagem do usuário para a pergunta real
      setMessages((prev) => {
         const updated = [...prev];
         // Atualiza a última mensagem (que era "Enviando PDF...")
         updated[updated.length - 1].content = prompt; 
         return updated;
      });

      // 5. Chama o streaming com o novo prompt
      // Precisamos passar o novo array de mensagens para fetchChatStream
      const contextMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
      
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]); // Placeholder
      
      const response = await fetchChatStream(contextMessages);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        receivedText += chunk;
        
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = receivedText;
          return updatedMessages;
        });
      }

    } catch (error) {
      console.error('Erro no fluxo de upload:', error);
      setMessages((prev) => [...prev, 
        { role: 'assistant', content: `❌ Erro ao enviar PDF: ${error instanceof Error ? error.message : "Falha."}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]); // Depende de messages e isLoading

  const value: ChatContextType = {
    messages,
    isLoading,
    sendMessage,
    uploadAndAskPdf: uploadAndAskPdf_Refatorado, // Usa a versão refatorada
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};