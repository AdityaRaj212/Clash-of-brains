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