// Exemplo de index.ts ou server.ts
import express from 'express';
import chatRoutes from './routes/chat.routes'; // Ajuste o caminho conforme a estrutura do seu projeto
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware ESSENCIAL para parsear o corpo da requisição JSON
// Sem esta linha, o req.body será undefined e a rota /chat falhará.
app.use(express.json());

// Rota principal de chat
app.use('/chat', chatRoutes); 

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});