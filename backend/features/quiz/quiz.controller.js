import QuizRepository from "./quiz.repository.js";

export default class QuizController{

    constructor(){
        this.quizRepository = new QuizRepository();
    }

    async createQuiz(req,res){
        const {no_of_questions} = req.body;
        const newQuiz = await this.quizRepository.createQuiz(no_of_questions);
        res.status(201).json({
            status: true,
            quiz: newQuiz
        });
    }

    async getQuizById(req,res){
        const quizId = req.params.quizId;
        const quiz = await this.quizRepository.getQuizById(quizId);
        res.status(200).json({
            status: true,
            quiz: quiz
        });
    }

    async getAllQuizzes(req,res){
        const quizzes = await this.quizRepository.getAllQuizzes();
        res.status(200).json({
            status: true,
            quizzes: quizzes
        });
    }

    async deleteQuizById(req,res){
        const quizId = req.params.quizId;
        const deletedQuiz = await this.quizRepository.deleteQuizById(quizId);
        res.status(201).json({
            status: true,
            quiz: deletedQuiz
        });
    }
}