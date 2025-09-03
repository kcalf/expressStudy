import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', router);

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.listen(PORT, () => {
    console.log(`API server running http://localhost:${PORT}`);
});