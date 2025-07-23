import express from 'express';
import router from './routes/index.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/',router);

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
