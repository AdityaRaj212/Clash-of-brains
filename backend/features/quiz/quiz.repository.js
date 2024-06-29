import { QuizModel } from "./quiz.schema.js";
import { QuestionModel } from "./../question/question.schema.js";

const getRandomQuestions = async (no_of_questions) => {
    try{
        const questions = await QuestionModel.aggregate([
            {$sample: {size: no_of_questions}},
            {$project: {_id:1}}
        ]);
        return questions.map(q=>q._id);
    }catch(err){
        console.log('Error while generating random questions');
        throw new Error('Error while generating random questions');
    }
}

export default class QuizRepository{
    async createQuiz(no_of_questions){
        try{
            const questionIds = await getRandomQuestions(no_of_questions);
            const newQuiz = new QuizModel({
                questionIds: questionIds,
                attemptedBy: [],
                totalScore: 0,
                highestScore: 0,
                createdAt: Date.now()
            });
            await newQuiz.save();
            return newQuiz;
        }catch(err){
            console.log('Error while generating quiz: ' + err);
            throw new Error('Error while generating quiz: ');
        }
    }  
    
    async getQuizById(quizId){
        try{
            const quiz = await QuizModel.findById(quizId);
            if(!quiz){
                throw new Error('Quiz not found');
            }
            return quiz;
        }catch(err){
            console.log('Error while fetching quiz');
            throw new Error('Error while fetching quiz');
        }
    }

    async getAllQuizzes(){
        try{
            const quizzes = await QuestionModel.find();
            return quizzes;
        }catch(err){
            console.log('Error while fetching quizzes');
            throw new Error('Error while fetching quizzes');
        }
    }

    async getActiveQuizzes(){
        try{
            const activeQuizzes = await QuizModel.find({locked:false});
            return activeQuizzes;
        }catch(err){
            console.error('Error while fetching active quizzes: ' + err);
            throw new Error(err);
        }
    }

    async getQuizByPlayer(userId) {
        try {
            const quiz = await QuizModel.findOne({ players: userId });
            return quiz;
        } catch (err) {
            console.log('Error while fetching quiz by player');
            throw new Error('Error while fetching quiz by player');
        }
    }

    async deleteQuizById(quizId){
        try{
            const deletedQuiz = await QuizModel.findByIdAndDelete(quizId);
            if(!deletedQuiz){
                throw new Error('Unable to delete quiz');
            }
            return deletedQuiz;
        }catch(err){
            console.log('Error while deleting quiz');
            throw new Error('Error while deleting quiz');
        }
    }
}