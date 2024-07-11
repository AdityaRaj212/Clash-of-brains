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

    async updateScore(userId, updatedScore){
        try{
            const user = await UserModel.findById(userId);
            if(user){
                user.currentScore = updatedScore;
                user.save();
            }
            return user;

        }catch(err){
            console.error('Error while updating user score: ' + err);
            throw err;
        }
    }

    async updateTotalScore(userId, score){
        try{
            const user = await UserModel.findById(userId);
            if(user){
                user.totalScore = user.totalScore + score;
                user.save();
            }
            return user;
        }catch(err){
            console.error('Error while updating total score: ' + err);
            throw err;
        }
    }

    async updateGamesPlayed(userId){
        try{
            const user = await UserModel.findById(userId);
            if(user){
                user.gamesPlayed = user.gamesPlayed + 1;
                user.save();
            }
            return user;
        }catch(err){
            console.error('Error while updating no of games played: ' + err);
            throw err;
        }
    }

    async updateGamesWon(userId){
        try{
            const user = await UserModel.findById(userId);
            if(user){
                user.gamesWon = user.gamesWon + 1;
                user.save();
            }
            return user;
        }catch(err){
            console.error('Error while updating no of games won: ' + err);
            throw err;
        }
    }

    async getUsersForLeaderboard(){
        try{
            const users = await UserModel.find().sort({totalScore:-1});
            return users;
        }catch(err){
            console.error('Error while getting users for leaderboard: ' + err);
            throw err;
        }
    }

    async resetScore(userId){
        
    }
}