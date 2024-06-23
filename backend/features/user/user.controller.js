import UserRepository from "./user.repository.js";
import jwt from 'jsonwebtoken';


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

    async getUserById(req,res){
        const userId = req.params.userId;
        const user = await this.userRepository.getUserById(userId);
        res.status(200).json({
            status: true,
            user: user
        })
    }

    async test(req,res){
        res.send('test successful');
    }
}