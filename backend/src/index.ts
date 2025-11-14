// src/index.ts (BACKEND - CORRIGIDO)

import express from 'express';
import chatRoutes from './routes/chat.routes'; 
import * as dotenv from 'dotenv';
import cors from 'cors'; // 1. Importe o 'cors'

// Carrega variáveis de ambiente
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORREÇÃO DE CORS ---
// 2. Defina de qual origem você aceitará requisições
const corsOptions = {
    origin: 'http://localhost:5173' // A URL do seu frontend Vite
};

// 3. Use o middleware 'cors' ANTES de suas rotas
app.use(cors(corsOptions));
// ----------------------

// Middleware ESSENCIAL para parsear o corpo da requisição JSON
app.use(express.json());

// Rota principal de chat
app.use('/chat', chatRoutes); 

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});