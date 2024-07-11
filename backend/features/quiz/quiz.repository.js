import { QuizModel } from "./quiz.schema.js";
import { QuestionModel } from "./../question/question.schema.js";
import axios from "axios";

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
            let maxScore = 0;
            
            for (const questionId of questionIds) {
                const question = await QuestionModel.findById(questionId);
                if (question) {
                    maxScore += question.points;
                }
            }

            const newQuiz = new QuizModel({
                questionIds: questionIds,
                attemptedBy: [],
                totalScore: maxScore,
                highestScore: 0,
                scores: [0,0],
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
            const quizzes = await QuizModel.find();
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

    async updateAttemptedBy(userId,quizId){
        try{
            const quiz = await QuizModel.findByIdAndUpdate(
                quizId,
                { $addToSet: { attemptedBy: userId } }, 
                { new: true } 
            );
            
            if (!quiz) {
                throw new Error('Quiz not found');
            }
            
            return quiz;
        }catch(err){
            console.error('Error while updating attempted by: ' + err);
            throw err;
        }
    }

    async updateScore(quizId, userId, score){
        try{
            const quiz = await QuizModel.findById(quizId);
            if(quiz.players[0]==userId){
                quiz.scores[0] = score;
            }else{
                quiz.scores[1] = score;
            }
            await quiz.save();
            return quiz;
        }catch(err){
            console.error('Error while updating score: ' + err);
            throw err;
        }
    }

    async updateHighestScore(quizId){
        const quiz = await QuizModel.findById(quizId);
        try{
            quiz.highestScore = (quiz.scores[0]>quiz.scores[1]) ? quiz.scores[0] : quiz.scores[1];
            await quiz.save();
            return quiz;
        }catch(err){
            console.error('Error while updating highest score: ' + err);
            throw err;
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