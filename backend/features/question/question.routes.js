import express from 'express';
import QuestionController from './question.controller.js';

const router = express.Router();

const questionController = new QuestionController();

router.post('/create', (req,res)=>{
    questionController.createQuestion(req,res);
});

router.get('/get-by-id/:questionId',(req,res)=>{
    questionController.getQuestionById(req,res);
});

router.get('/all',(req,res)=>{
    questionController.getAllQuestions(req,res);
})

router.put('/update/:questionId',(req,res)=>{
    questionController.updateQuestion(req,res);
});

router.delete('/delete/:questionId',(req,res)=>{
    questionController.deleteQuestionById(req,res);
});

export default router;