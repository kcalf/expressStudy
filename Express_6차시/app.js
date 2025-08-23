import express from 'express';
import router from './routes/index.js'
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { logger } from './middlewares/logger.js';
import { delay } from './middlewares/delay.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());              // CORS 허용

app.use('/',router);

app.use(helmet());            // 보안 헤더 설정
app.use(morgan('tiny'));      // 요청 로깅

app.use(logger);      // 모든 요청에 로깅 적용
app.use('/test', delay);  // /test 경로에만 지연 적용

function formatDate(time){
    const date = new Date(time);
    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});