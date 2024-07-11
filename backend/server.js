import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectUsingMongoose } from './config/mongoose.js';

import userRouter from './features/user/user.routes.js';
import questionRouter from './features/question/question.routes.js';
import quizRouter from './features/quiz/quiz.routes.js';

const server = express();

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({
    secret: 'aditya_quizapp',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files from the frontend build directory
const buildPath = path.resolve(__dirname, '../frontend/build');
console.log(`Serving static files from ${buildPath}`);
server.use(express.static(buildPath));

server.use('/api/users', userRouter);
server.use('/api/question', questionRouter);
server.use('/api/quiz', quizRouter);

server.get('*', (req, res) => {
    const indexPath = path.resolve(__dirname, '../frontend/build', 'index.html');
    console.log(`Serving index.html from ${indexPath}`);
    res.sendFile(indexPath);
});

server.listen(3400, () => {
    console.log('Server is up and running at 3400');
    connectUsingMongoose();
});




// import express from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import cors from 'cors';
// import path from 'path';

// import { connectUsingMongoose } from './config/mongoose.js';

// import userRouter from './features/user/user.routes.js';
// import questionRouter from './features/question/question.routes.js';
// import quizRouter from './features/quiz/quiz.routes.js';

// const server = express();

// server.use(express.urlencoded({extended: true}));
// server.use(cors());
// server.use(bodyParser.json());
// server.use(cookieParser());0
// server.use(session({
//     secret: 'aditya_quizapp',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {secure:false}
// }));

// // Serve static files from the frontend build directory
// server.use(express.static(path.join(path.resolve(), '../frontend/build')));

// server.use('/api/users', userRouter);
// server.use('/api/question',questionRouter);
// server.use('/api/quiz',quizRouter);

// server.get('*', (req, res) => {
//     res.sendFile(path.join(path.resolve(), '../frontend/build', 'index.html'));
// });

// server.listen(3400,()=>{
//     console.log('Server is up and running at 3400');
//     connectUsingMongoose();
// })
