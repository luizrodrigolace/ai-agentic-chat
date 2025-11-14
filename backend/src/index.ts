// src/index.ts (BACKEND - ATUALIZADO)

import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chat.routes'; 
import uploadRoutes from './routes/upload.routes'; // 1. Importe a nova rota

// Carrega variáveis de ambiente
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:5173' // URL do seu frontend
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// --- ROTAS ---
app.use('/chat', chatRoutes); 
app.use('/upload-pdf', uploadRoutes); // 2. Adicione a rota de upload

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});