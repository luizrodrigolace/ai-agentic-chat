// src/routes/upload.routes.ts
import { Router } from 'express';
import { handlePdfUpload } from '../controllers/upload.controller';
import uploadMiddleware from '../services/upload.service';

const router = Router();

// Define a rota POST /upload
// 1. 'uploadMiddleware.single('pdf')': Espera um campo 'pdf' no form-data
// 2. 'handlePdfUpload': O controller que executa após o upload
router.post('/', uploadMiddleware.single('pdf'), handlePdfUpload);

export default router;