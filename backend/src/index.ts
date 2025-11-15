import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chat.routes'; 
import uploadRoutes from './routes/upload.routes';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/chat', chatRoutes); 
app.use('/upload-pdf', uploadRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});