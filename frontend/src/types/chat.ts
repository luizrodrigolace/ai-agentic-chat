export type ChatMessage = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
};

export type ChatContextType = {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (prompt: string) => Promise<void>;
  //lida com o upload do PDF e envia uma pergunta sobre ele.
  uploadAndAskPdf: (file: File) => Promise<void>;
};