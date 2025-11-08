import { Response } from 'express';
import { Experimental_Agent as Agent, stepCountIs } from 'ai'; // se der erro, troque por Experimental_Agent
import { createGroq } from '@ai-sdk/groq';
import { tools } from './tools.service';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

// Função principal que lida com o agent
export async function runAgent(prompt: string, res: Response) {
  try {
    console.log('[SERVER] 🔹 Criando agente com Groq e ferramentas...');
    console.log('[SERVER] Prompt recebido:', prompt);

    const agent = new Agent({
      model: groq('llama-3.3-70b-versatile'),
      tools,
      system: "Você é um assistente que sempre usa as ferramentas disponíveis para obter respostas precisas e atualizadas.",
      stopWhen: stepCountIs(10), // evita loops infinitos
    });

    console.log('[SERVER] 🔹 Executando agent...');
    const result = await agent.generate({ prompt });

    console.log('[SERVER] ✅ Resposta final:', result.text);
    console.log('[SERVER] 🧩 Passos executados:', result.steps);

    res.json({
      success: true,
      response: result.text,
      steps: result.steps,
    });
  } catch (err) {
    console.error('[SERVER] ❌ Erro no agent:', err);
    res.status(500).json({ error: 'Erro ao gerar resposta.' });
  }
}
