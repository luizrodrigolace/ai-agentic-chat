import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatMessage from '././ChatMessage';
import './ChatMessagesList.css';

const ChatMessagesList: React.FC = () => {
    const { messages, isLoading } = useChat(); 
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // auto-scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="messages-list-container">
            {messages.length === 0 && !isLoading && (
                <div className="welcome-message">
                    Olá! Eu sou seu assistente. 
                    <ul>
                        <li>Clima em uma cidade (ex: "Qual o clima em Tóquio?")</li>
                        <li>Cotação de moeda (ex: "USD para BRL")</li>
                        <li>Leitura de PDF (ex: "Leia o arquivo /docs/relatorio.pdf")</li>
                    </ul>
                </div>
            )}
            
            {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
                <div className="loading-indicator">
                    O Agente está pensando...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessagesList;