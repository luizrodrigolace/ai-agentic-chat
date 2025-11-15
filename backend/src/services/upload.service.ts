import multer from 'multer';
import path from 'path';
import fs from 'fs';

// define o diretório de uploads
const uploadDir = path.join(__dirname, '../../uploads');

// garante que o diretório exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Configura o "storage" do multer
const storage = multer.diskStorage({
  // Onde salvar o arquivo
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Como nomear o arquivo (mantém o nome original + timestamp)
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// middleware de upload
// aceita apenas um arquivo, com o nome de campo 'pdf'
const uploadMiddleware = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validação para aceitar apenas PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Apenas PDFs são aceitos.'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10 // Limite de 10MB
  }
});

export default uploadMiddleware;