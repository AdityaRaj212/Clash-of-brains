import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
    },
    questionImage: {
        type: String,
    },
    option: [
        {
            text: {
                type: String,
                required: function() {
                    // Required if 'image' is not provided or is an empty string
                    return !(this.image && this.image.trim() !== '');
                }
            },
            image: {
                type: String,
                required: function() {
                    // Required if 'text' is not provided or is an empty string
                    return !(this.text && this.text.trim() !== '');
                }
            }
        }
    ],
    answer: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        default: 10
    },
    difficulty: {
        type: Number,
        default: 3,
        min: 1,
        max: 5
    },
    topic: [
        {
            type: String
        }
    ],
    time: {
        type: Date,
        default: Date.now()
    },
    solvedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    attemptedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    uploadedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
});

export const QuestionModel = mongoose.model('Question', QuestionSchema);