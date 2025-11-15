import { Request, Response } from 'express';

export const handlePdfUpload = (req: Request, res: Response) => {
  try {
    // O 'req.file' é populado pelo middleware 'multer'
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo PDF foi enviado.' });
    }

    const filePath = req.file.path; 

    console.log(`[SERVER] ✅ PDF recebido e salvo em: ${filePath}`);

    res.json({
      success: true,
      message: 'PDF enviado com sucesso.',
      filePath: filePath, // O frontend usará este caminho
    });
  } catch (error) {
    console.error('[SERVER] ❌ Erro no upload:', error);
    res.status(500).json({ error: 'Falha ao processar o upload do PDF.' });
  }
};