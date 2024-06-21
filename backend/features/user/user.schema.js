import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
          validator: validator.isStrongPassword,
          message: props => `${props.value} is not a valid password! Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character.`
        }
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    }
});

export const UserModel = mongoose.model('User',UserSchema);