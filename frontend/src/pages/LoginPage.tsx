import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        navigate('/chat', { replace: true });
    };

    return (
        <div className="login-container">
            <div className="login-form-box">
                <h2>Assistente AI - Login</h2>
                <p>O login é mockado para fins de demonstração.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Nome de Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        Entrar (Mock)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;