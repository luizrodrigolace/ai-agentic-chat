import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runAgent } from './services/ai/ai.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  console.log('[SERVER] Rota /chat atingida.');
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt não enviado.' });
  }

  await runAgent(prompt, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
