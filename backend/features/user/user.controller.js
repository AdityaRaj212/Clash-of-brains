import UserRepository from "./user.repository.js";
import jwt from 'jsonwebtoken';
import pusher from "../../config/pusher.js";


export default class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }

    async signUp(req,res){
        console.log('yo');
        const {name, userName, email, password} = req.body;
        const newUser = await this.userRepository.addUser(name,userName,email, password);
        res.status(201).json({
            status: true,
            user: newUser
        });
    }

    async signIn(req,res){
        const {email,password} = req.body;
        const user = await this.userRepository.getUser(email,password);
        if(user){
            user.status = 'Online';
            user.lastActive = Date.now();
            await user.save();
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                'secret',
                {
                    expiresIn: '24h'
                }
            );

            pusher.trigger('users','new-user',{
                user: user
            });

            // res.cookie('jwtToken',token,{
            //     maxAge: 24*60*60*1000
            // });
            // res.cookie('userId',user._id,{
            //     maxAge: 24*60*60*1000
            // })
            // res.cookie('userInfo',JSON.stringify(user),{
            //     maxAge: 24*60*60*1000
            // });
            res.status(200).send({
                user,
                token
            });
            // console.log('signed in');
        }else{
            res.status(401).json({
                status: false,
                msg: "Invalid credentials"
            });
        }
    }

    async signOut(req,res){
        try{
            const userId = req.params.userId;
            console.log(userId);
            const user = await this.userRepository.signOut(userId);
            user.status = 'Offline';
            await user.save();
            pusher.trigger('users','user-logged-out',{
                userId: userId
            })
            res.status(201).json({
                status: true,
                msg: 'logged out successfully',
                user: user
            });
        }catch(err){
            res.status(500).json({
                status: false,
                msg: 'Failed to logout',
                error: err.message
            })
        }
    }

    async getUserById(req,res){
        const userId = req.params.userId;
        const user = await this.userRepository.getUserById(userId);
        res.status(200).json({
            status: true,
            user: user
        })
    }

    async getOnlineUsers(req, res) {
        const users = await this.userRepository.getOnlineUsers();
        res.status(200).json({
            status: true,
            users: users
        });
    }

    async updateScore(req,res){
        const {userId, quizId, newScore} = req.body;
        try{
            const updatedUser = await this.userRepository.updateScore(userId,newScore);
            pusher.trigger(`quiz-${quizId}`,'score-updated',{
                userId,
                newScore,
            });
            res.status(201).json({
                status: true,
                msg: 'Score-updated',
                user: updatedUser,
            })
        }catch(err){
            res.status(500).json({
                status: false,
                error: err.message,
            })
        }
    }

    async test(req,res){
        res.send('test successful');
    }
}