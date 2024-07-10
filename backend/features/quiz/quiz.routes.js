import express from 'express';
import QuizController from './quiz.controller.js';

const router = express.Router();

const quizController = new QuizController();

router.get('/create/:userId', (req,res)=>{
    quizController.createQuiz(req,res);
});

router.get('/get-by-id/:quizId',(req,res)=>{
    quizController.getQuizById(req,res);
});

router.get('/all-quizzes', (req,res)=>{
    quizController.getAllQuizzes(req,res);
});

router.get('/delete/:quizId',(req,res)=>{
    quizController.deleteQuizById(req,res);
});

router.post('/end',(req,res)=>{
    quizController.endQuiz(req,res);
});

router.post('/attempted-by',(req,res)=>{
    quizController.updateAttemptedBy(req,res);
})

export default router;