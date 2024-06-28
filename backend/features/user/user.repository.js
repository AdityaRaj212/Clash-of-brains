import { UserModel } from "./user.schema.js";

export default class UserRepository{
    async addUser(name, userName, email, password){
        try{
            const newUser = new UserModel({
                name,
                userName,
                email, 
                password,
            });
            await newUser.save();
            return newUser;
        }catch(err){
            console.log('Error while creating user account: ' + err);
            throw err;
        }
    }

    async signOut(userId){
        try{
            const user = await UserModel.findById(userId);
            console.log(user);
            return user;
        }catch(err){
            console.log('Error while loggin out');
            throw err;
        }
    }

    async getUser(email,password){
        try{
            const user = await UserModel.findOne({email, password});
            return user;
        }catch(err){
            console.log('Error while searching user: ' + err);
            throw err;
        }
    }

    async getUserById(userId){
        try{
                const user = await UserModel.findById(userId);
                return user;
        }catch(err){
            console.log('Error while fetching user by id: ' + err);
            throw err;
        }
    }

    async getOnlineUsers() {
        const users = await UserModel.find({ status: 'Online' });
        return users;
    }
}