// Conteúdo atualizado de: ai.service.ts

import { Response } from 'express';
// Se der erro, troque por Experimental_Agent
import { Experimental_Agent as Agent, stepCountIs } from 'ai'; 
import { createGroq } from '@ai-sdk/groq';
import { tools } from './tools.service';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

// Função principal que lida com o streaming da resposta do agente
// Esta função é chamada pelo chat.controller.ts
export async function streamTextResponse(messages: any[], res: Response) { 
  try {
    console.log('[SERVER] 🔹 Criando agente com Groq e ferramentas...');

    // O agente usa as ferramentas e o modelo Llama 3.3
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
    console.log('[SERVER] 🔎 Mensagens de entrada (formato esperado: {role: string, content: string}):', messages);
    
    console.log('[SERVER] 🔹 Executando agent em modo STREAMING...');
    
    // 1. Configura os cabeçalhos para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // 2. Inicia o streaming. Passamos a array 'messages' completa.
    // ⚠️ ATENÇÃO: Se o erro persistir, o problema é que o CLIENTE (Postman/Frontend) 
    // não está enviando objetos {role: 'user', content: 'texto'}, e sim apenas ['texto'].
    const { fullStream } = await agent.stream({ messages }); 

    // 3. Itera sobre o stream e envia cada chunk para o cliente
    for await (const chunk of fullStream) { 
        // Type guard para garantir que a propriedade 'text' existe
        if ('text' in chunk) {
            // 🚨 Console.log para verificação dos chunks
            console.log('[CHUNK] ->', chunk.text); 
            
            // Envia o texto imediatamente
            res.write(chunk.text);
        }
    }

    // 4. Finaliza a resposta HTTP
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