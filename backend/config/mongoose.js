import mongoose from "mongoose";
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('MongoDB URI:', process.env.MONGO_URI);

// const url = "mongodb+srv://adityaeducation212:adityadb212@cluster0.jm0dl8u.mongodb.net/less-go?retryWrites=true&w=majority&appName=Cluster0";
const url = "mongodb://127.0.0.1:27017/less-go";
// const url = process.env.MONGO_URI;

export const connectUsingMongoose = async () => {
    try{
        await mongoose.connect(url);
        console.log('MongoDB is connected using mongoose');
    }catch(err){
        console.log('Error while connecting to DB: ' + err);
    }
}