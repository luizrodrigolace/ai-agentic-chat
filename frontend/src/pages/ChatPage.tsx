// src/pages/ChatPage.tsx

import React from 'react';
import ChatMessagesList from '../components/Chat/ChatMessagesList';
import ChatInput from '../components/Chat/ChatInput';
import './ChatPage.css'; // Importa o CSS

const ChatPage: React.FC = () => {

    return (
        <div className="chat-page-container">
            <header className="chat-header">
                <h1>🤖 Assistente com Agents</h1>
            </header>
            <div className="chat-box">
                <ChatMessagesList />
            </div>
            <div className="chat-input-area">
                <ChatInput />
            </div>
        </div>
    );
};

export default ChatPage;