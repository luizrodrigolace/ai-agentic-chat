// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';

// Importação das Páginas
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rota de Login */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rota de Chat (agora pública, mas envolve o ChatProvider) */}
                <Route 
                    path="/" 
                    element={
                        <ChatProvider>
                            <ChatPage />
                        </ChatProvider>
                    } 
                />
                
                {/* Redirecionamento padrão para a tela de login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;