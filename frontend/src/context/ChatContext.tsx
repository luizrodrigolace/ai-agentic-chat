import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchChatStream, uploadPdfApi } from '../services/chatService';
import { ChatMessage, ChatContextType } from '../types/chat';

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


  const _runStreamLogic = useCallback(async (contextMessages: ChatMessage[]) => {
    setIsLoading(true);
    
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      // chama a API de streaming com o contexto completo
      const response = await fetchChatStream(contextMessages); 
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      // lê e processa o stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        receivedText += chunk;
        
        // atualiza a última mensagem (o placeholder) com o novo texto
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = receivedText;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Erro ao processar streaming:', error);
      // substitui o placeholder por uma mensagem de erro
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = `❌ Erro: ${error instanceof Error ? error.message : "Falha desconhecida."}`;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, []); // este useCallback não tem dependências, pois usa apenas 'set'

  // envia uma mensagem de texto simples para o agente.
  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const newContextMessages = [...messages, userMessage]; 
    
    // adiciona a mensagem do usuário à UI
    setMessages(newContextMessages);
    
    // inicia o streaming
    await _runStreamLogic(newContextMessages);

  }, [messages, isLoading, _runStreamLogic]);

  /**
   * fluxo de upload de PDF:
   * 1. Faz o upload do arquivo para o backend.
   * 2. Recebe o caminho do arquivo no servidor.
   * 3. Envia um prompt para o agente analisar o arquivo.
   */
  const uploadAndAskPdf = useCallback(async (file: File) => {
    if (isLoading) return;

    setIsLoading(true);

    // adiciona uma mensagem de "Enviando..."
    const uploadUserMessage: ChatMessage = { role: 'user', content: `Enviando PDF: ${file.name}...` };
    setMessages((prev) => [...prev, uploadUserMessage]);
    
    try {
      // faz o upload do arquivo
      const uploadResult = await uploadPdfApi(file);
      const serverFilePath = uploadResult.filePath;
      
      // cria o prompt de análise
      const prompt = `O arquivo PDF está localizado em: ${serverFilePath}. Faça um breve resumo do conteúdo deste arquivo.`;
      
      // atualiza a mensagem "Enviando..." para o prompt real e inicia o stream
      // usamos a forma funcional do 'setMessages' para garantir o estado mais recente
      setMessages((prev) => {
         const updatedMessages = [...prev];
         // atualiza a última mensagem (o "Enviando...")
         updatedMessages[updatedMessages.length - 1].content = prompt; 
         
         // inicia o stream com o contexto de mensagens atualizado
         _runStreamLogic(updatedMessages); 
         
         return updatedMessages;
      });

    } catch (error) {
      console.error('Erro no fluxo de upload:', error);
      setMessages((prev) => [...prev, 
        { role: 'assistant', content: `❌ Erro ao enviar PDF: ${error instanceof Error ? error.message : "Falha."}` }
      ]);
      setIsLoading(false);
    } 
    // o 'finally' é tratado dentro do _runStreamLogic
  }, [isLoading, _runStreamLogic]); 

  const value: ChatContextType = {
    messages,
    isLoading,
    sendMessage,
    uploadAndAskPdf,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};