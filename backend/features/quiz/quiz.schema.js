import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    questionIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    attemptedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    totalScore: {
        type: Number,
        default: 0
    },
    highestScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    locked: {
        type: Boolean,
        default: false,
    }
});

export const QuizModel = mongoose.model('Quiz',QuizSchema);