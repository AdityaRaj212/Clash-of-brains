import express from 'express';
import UserController from './user.controller.js';

const router = express.Router();

const userController = new UserController();

router.post('/signUp',(req,res)=>{
    userController.signUp(req,res);
});

router.post('/signIn', (req,res)=>{
    userController.signIn(req,res);
});

router.post('/update-score',(req,res)=>{
    userController.updateScore(req,res);
});

router.put('/signOut/:userId',(req,res)=>{
    userController.signOut(req,res);
})

router.get('/get-user-by-id/:userId', (req,res)=>{
    userController.getUserById(req,res);
});

router.get('/test',(req,res)=>{
    userController.test(req,res);
});

router.get('/online',(req,res)=>{
    userController.getOnlineUsers(req,res);
});

export default router;



