import mongoose from "mongoose";
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('MongoDB URI:', process.env.MONGO_URI);

// const url = "mongodb+srv://adityaeducation212:adityadb212@cluster0.jm0dl8u.mongodb.net/clash-of-brains?retryWrites=true&w=majority&appName=Cluster0";
const url = "mongodb://127.0.0.1:27017/less-go";
// const url = process.env.MONGO_URI;

export const connectUsingMongoose = async () => {
    try{
        await mongoose.connect(url);
        console.log('MongoDB is connected using mongoose');
        // await dropIndex();
    }catch(err){
        console.log('Error while connecting to DB: ' + err);
    }
}

// export const dropIndex = async () => {
//     try {
//         const result = await mongoose.connection.db.collection('quizzes').dropIndex('players_1');
//         console.log('Index dropped:', result);
//     } catch (err) {
//         console.log('Error dropping index:', err.message);
//     }
// };