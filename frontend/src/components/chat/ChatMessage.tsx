// src/components/Chat/ChatMessage.tsx

import React from 'react';
import { ChatMessage as MessageType } from '../../types/chat';
import './ChatMessage.css'; // Importa o CSS

interface ChatMessageProps {
    message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    
    // Define as classes dinamicamente
    const messageClasses = `chat-message ${isUser ? 'user' : 'assistant'}`;

    return (
        <div className={messageClasses}>
            {/* Adiciona um simples <pre> para formatar melhor a saída se tiver quebras de linha */}
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit' }}>
                {message.content}
            </pre>
        </div>
    );
};

export default ChatMessage;