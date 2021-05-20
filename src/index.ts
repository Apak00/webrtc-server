import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import authRouter from './routers/auth';
import usersRouter from './routers/users';
import coursesRouter from './routers/courses';
import corsPolicy from './constants/cors-policy';
import { initSocket } from './socket';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors(corsPolicy));
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);

app.get('/', (req: Request, res: Response) => res.send('Hello World!8'));

// Start App
const server = app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

export const io = initSocket(server);
