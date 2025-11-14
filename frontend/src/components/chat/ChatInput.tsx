// src/components/Chat/ChatInput.tsx

import React, { useState, FormEvent } from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatInput.css'; // Importa o CSS

const ChatInput: React.FC = () => {
    const [input, setInput] = useState('');
    const { sendMessage, isLoading } = useChat(); 

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Aguardando resposta..." : "Pergunte sobre clima, cotação ou PDF..."}
                disabled={isLoading}
                className="chat-input"
            />
            <button type="submit" disabled={isLoading} className="chat-submit-button">
                {isLoading ? '...' : 'Enviar'}
            </button>
        </form>
    );
};

export default ChatInput;