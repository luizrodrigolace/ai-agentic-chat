import { Router } from 'express';
import { handlePdfUpload } from '../controllers/upload.controller';
import uploadMiddleware from '../services/upload.service';

const router = Router();

// uploadMiddleware.single('pdf'): Espera um campo 'pdf' no form-data
// 'handlePdfUpload': O controller que executa após o upload
router.post('/', uploadMiddleware.single('pdf'), handlePdfUpload);

export default router;