import React from 'react';
import { ChatMessage as MessageType } from '../../types/chat';
import './ChatMessage.css';

interface ChatMessageProps {
    message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    
    // define as classes dinamicamente
    const messageClasses = `chat-message ${isUser ? 'user' : 'assistant'}`;

    return (
        <div className={messageClasses}>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit' }}>
                {message.content}
            </pre>
        </div>
    );
};

export default ChatMessage;