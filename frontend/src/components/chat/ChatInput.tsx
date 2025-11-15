import React, { useState, FormEvent, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatInput.css'; 

const ChatInput: React.FC = () => {
    const [input, setInput] = useState('');
    const { sendMessage, isLoading, uploadAndAskPdf } = useChat(); 
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Apenas arquivos PDF são permitidos.');
                return;
            }
            uploadAndAskPdf(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="file-input" 
                onChange={handleFileChange}
                accept="application/pdf"
            />
            
            <button 
                type="button" 
                className="upload-button" 
                onClick={handleUploadClick} 
                disabled={isLoading}
                title="Enviar PDF"
            >
                📎
            </button>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Processando..." : "Pergunte sobre clima, cotação ou PDF..."}
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