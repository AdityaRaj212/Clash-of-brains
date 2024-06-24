import QuestionRepository from "./question.repository.js";

import pusher from "../../config/pusher.js";

export default class QuestionController{

    constructor(){
        this.questionRepository = new QuestionRepository();
    }

    async createQuestion(req,res){
        try{
            const questionData = req.body;
            console.log(req.body);
            const newQuestion = await this.questionRepository.createQuestion(questionData);

            pusher.trigger('questions','new-question',{
                question: newQuestion
            });

            res.status(201).json({
                status: true,
                question: newQuestion
            });
        }catch(err){
            console.log('Error while creating question: ' + err);
            res.status(500).json({
                status: false,
                message: 'Error creating question',
                error: err.message
            });
        }
    }

    async getQuestionById(req,res){
        try{
            const questionId = req.params.questionId;
            const question = await this.questionRepository.getQuestion(questionId);
            res.status(200).json({
                status: true,
                question: question
            })
        }catch(err){
            throw err;
        }
    }

    async getAllQuestions(req,res){
        try{
            const questions = await this.questionRepository.getAllQuestions();
            res.status(200).json({
                status: true,
                questions: questions
            })
        }catch(err){
            res.status(500).json({
                status: false,
                msg: 'Error while fetching all questions',
                error: err.message
            })
        }
    }

    async updateQuestion(req,res){
        try{
            const updateData = req.body;
            const questionId = req.params.questionId;
            const updatedQuestion = await this.questionRepository.updateQuestion(questionId, updateData);
            res.status(201).json({
                status: true,
                question: updatedQuestion
            });
        }catch(err){
            res.status(500).json({
                status: false,
                msg: 'Error while updating question',
                error: err.message
            })
        }
    }

    async deleteQuestionById(req,res){
        const questionId = req.params.questionId;
        const deletedQuestion = await this.questionRepository.deleteQuestionById(questionId);
        res.status(201).json({
            status: true,
            question: deletedQuestion
        })
    }
}