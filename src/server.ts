import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { protect } from './modules/auth';
import { createNewUser, signIn } from './handlers/user';
import router from './router';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.status(200);
    res.json({ message: "hello from express" });
})

app.use('/api', protect, router);

app.post('/user', createNewUser);
app.post('/signin', signIn);

export default app;