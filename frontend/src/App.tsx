import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';

import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route 
                    path="/chat" 
                    element={
                        <ChatProvider>
                            <ChatPage />
                        </ChatProvider>
                    } 
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;