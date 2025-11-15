import { Response } from 'express';
import { Experimental_Agent as Agent, stepCountIs } from 'ai'; 
import { createGroq } from '@ai-sdk/groq';
import { tools } from './tools.service';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

// lida com o streaming da resposta do agente, chamada pelo chat.controller.ts
export async function streamTextResponse(messages: any[], res: Response) { 
  try {
    console.log('[SERVER] 🔹 Criando agente com Groq e ferramentas...');

    const agent = new Agent({
      model: groq('llama-3.3-70b-versatile'),
      tools,
      system: "Você é um assistente que sempre usa as ferramentas disponíveis para obter respostas precisas e atualizadas.",
      stopWhen: stepCountIs(10), // evita loops infinitos
    });

    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Mensagens de chat estão vazias ou ausentes ou não são um array.');
    }
    
    // 🚨 Log para verificar o formato de entrada
    //console.log('[SERVER] 🔎 Mensagens de entrada (formato esperado: {role: string, content: string}):', messages);
    //console.log('[SERVER] 🔹 Executando agent em modo STREAMING...');
    
    // Configura os cabeçalhos para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Inicia o streaming. Passamos a array 'messages' completa.
    const { fullStream } = await agent.stream({ messages }); 

    // Itera sobre o stream e envia cada "chunk" para o cliente
    for await (const chunk of fullStream) { 
        // Type guard para garantir que a propriedade 'text' existe
        if ('text' in chunk) {
            // erificação dos chunks
            // console.log('[CHUNK] ->', chunk.text); 
            
            // Envia o texto imediatamente
            res.write(chunk.text);
        }
    }

    res.end();

    console.log('[SERVER] ✅ Streaming finalizado com sucesso.');
    
  } catch (err) {
    console.error('[SERVER] ❌ Erro no agent (Streaming):', err);
    // Tenta fechar a conexão em caso de erro
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao gerar resposta por streaming.' });
    } else {
      res.end();
    }
  }
}