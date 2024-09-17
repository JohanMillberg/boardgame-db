import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { protect } from './modules/auth';
import { createNewUser, logout, refresh, signIn } from './handlers/user';
import router from './router';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Api calls, protected using JWT
app.use('/api', protect, router);

app.post('/user', createNewUser);
app.post('/signin', signIn);
app.get('/refresh', refresh);
app.get('/logout', logout);

export default app;