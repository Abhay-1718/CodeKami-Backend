import dotenv from 'dotenv';
import express from 'express';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors'

const app = express();  

dotenv.config();


app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json())

app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('api working')
})



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

export default app;

