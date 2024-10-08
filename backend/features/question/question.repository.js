import { QuestionModel } from "./question.schema.js";

export default class QuestionRepository{
    async createQuestion(questionData, userId){
        try{
            const newQuestion = new QuestionModel({
                ...questionData,
                solvedBy: [],
                attemptedBy: [],
            });
            await newQuestion.save();
            return newQuestion;
        }catch(err){
            console.log('Error while creating question: ' + err);
            throw err;
        }
    }

    async getQuestion(questionId){
        try{
            const question = await QuestionModel.findById(questionId).populate('solvedBy attemptedBy uploadedBy');
            if(!question){
                throw new Error('Question not found');
            }
            return question;
        }catch(err){
            console.log('Error while fetching question: ' + err);
        }
    }

    async getAllQuestions(){
        try{
            const questions = await QuestionModel.find();
            return questions;
        }catch(err){
            console.log('Error while fetching all questions: ' + err);
            throw err;
        }
    }

    async updateQuestion(questionId, updateData){
        try{
            const updatedQuestion = await QuestionModel.findByIdAndUpdate(questionId, updateData, {new: true}).populate('solvedBy attemptedBy uploadedBy');
            if(!updatedQuestion){
                throw new Error('Question not found');
            }
            return updatedQuestion;
        }catch(err){
            console.log('Error while updating question: ' + err);
        }
    }

    async updateAttemptedBy(userId, questionId){
        try{
            const question = await QuestionModel.findByIdAndUpdate(
                questionId,
                { $addToSet: { attemptedBy: userId } }, 
                { new: true } 
            );
            
            if (!question) {
                throw new Error('Question not found');
            }
            
            return question;
        }catch(err){
            console.error('Error while updating attempted by: ' + err);
            throw err;
        }
    }

    async updateSolvedBy(userId, questionId){
        try{
            const question = await QuestionModel.findByIdAndUpdate(
                questionId,
                { $addToSet: { solvedBy: userId } }, 
                { new: true } 
            );
            
            if (!question) {
                throw new Error('Question not found');
            }
            
            return question;
        }catch(err){
            console.error('Error while updating solved by: ' + err);
            throw err;
        }
    }

    async deleteQuestionById(questionId){
        try{
            const deletedQuestion = await QuestionModel.findByIdAndDelete(questionId);
            if(!deletedQuestion){
                throw new Error('Question not found');
            }
            return deletedQuestion;
        }catch(err){
            console.log('Error while deleting question: ' + err);
        }
    }
}