import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

export async function readPdf(filePath: string) {
  try {
    // resolve o caminho absoluto
    const resolvedPath = path.resolve(filePath);
    console.log('📁 Lendo PDF em:', resolvedPath);

    // lê o arquivo
    const dataBuffer = fs.readFileSync(resolvedPath);

    const parser = new PDFParse({ data: dataBuffer });

    const result = await parser.getText();

    // encerra o parser e libera a memória
    await parser.destroy();

    // retorna apenas o texto extraído
    return result.text;
  } catch (error) {
    console.error('❌ Erro ao ler PDF:', error);
    return 'Falha ao processar o PDF.';
  }
}
