import { Request, Response } from 'express';
import { streamTextResponse } from '../services/ai/ai.service';

export async function handleChat(req: Request, res: Response) {
  console.log('[SERVER] Rota /chat atingida.');

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Mensagens não enviadas.' });

  // streaming da resposta para o cliente
  await streamTextResponse(messages, res);
}
