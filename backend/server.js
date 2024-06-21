import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import { connectUsingMongoose } from './config/mongoose.js';

import userRouter from './features/user/user.routes.js';
import questionRouter from './features/question/question.routes.js';
import quizRouter from './features/quiz/quiz.routes.js';

const server = express();

server.use(express.urlencoded({extended: true}));
server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({
    secret: 'aditya_quizapp',
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}));

server.use('/api/users', userRouter);
server.use('/api/question',questionRouter);
server.use('/api/quiz',quizRouter);

server.listen(3400,()=>{
    console.log('Server is up and running at 3400');
    connectUsingMongoose();
})
