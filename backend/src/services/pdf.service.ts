// src/services/pdf.service.ts
import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

export async function readPdf(filePath: string) {
  try {
    // Resolve o caminho absoluto
    const resolvedPath = path.resolve(filePath);
    console.log('📁 Lendo PDF em:', resolvedPath);

    // Lê o arquivo
    const dataBuffer = fs.readFileSync(resolvedPath);

    // Cria o parser
    const parser = new PDFParse({ data: dataBuffer });

    // Extrai o texto do PDF
    const result = await parser.getText();

    // Encerra o parser e libera a memória
    await parser.destroy();

    // Retorna apenas o texto extraído
    return result.text;
  } catch (error) {
    console.error('❌ Erro ao ler PDF:', error);
    return 'Falha ao processar o PDF.';
  }
}
