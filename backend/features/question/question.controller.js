import QuestionRepository from "./question.repository.js";

export default class QuestionController{

    constructor(){
        this.questionRepository = new QuestionRepository();
    }

    async createQuestion(req,res){
        const questionData = req.body;
        const newQuestion = await this.questionRepository.createQuestion(questionData);
        res.status(201).json({
            status: true,
            question: newQuestion
        });
    }

    async getQuestionById(req,res){
        const questionId = req.params.questionId;
        const question = await this.questionRepository.getQuestion(questionId);
        res.status(200).json({
            status: true,
            question: question
        })
    }

    async updateQuestion(req,res){
        const updateData = req.body;
        const questionId = req.params.questionId;
        const updatedQuestion = await this.questionRepository.updateQuestion(questionId, updateData);
        res.status(201).json({
            status: true,
            question: updatedQuestion
        })
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