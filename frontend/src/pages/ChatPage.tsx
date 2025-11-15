import React from 'react';
import ChatMessagesList from '../components/Chat/ChatMessagesList';
import ChatInput from '../components/Chat/ChatInput';
import './ChatPage.css';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="chat-page-container">
            <header className="chat-header">
                <h1>🤖 Assistente com Agents</h1>
                
                <button 
                    onClick={handleLogout} 
                    className="chat-logout-button"
                >
                    Sair
                </button>
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