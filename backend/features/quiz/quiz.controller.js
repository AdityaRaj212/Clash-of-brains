import QuizRepository from "./quiz.repository.js";
import matchMakingQueue from './../../config/queue.js';
import pusher from "../../config/pusher.js";
import UserRepository from "../user/user.repository.js";

export default class QuizController {
    constructor() {
        this.quizRepository = new QuizRepository();
        this.userRepository = new UserRepository();
    }

    async createQuiz(req, res) {
        const no_of_questions = 3;
        const userId = req.params.userId;

        try {
            if (!matchMakingQueue.includes(userId)) {
                matchMakingQueue.enqueue(userId);
            } 
            else {
                console.log('in');
                console.log('Same user found');
                return res.status(200).json({
                    status: false,
                    message: 'User is already in the queue.',
                });
            }
            console.log('out');


            // Check if there are enough users to start a quiz
            if (matchMakingQueue.length >= 2) {
                const user1 = matchMakingQueue.dequeue();
                const user2 = matchMakingQueue.dequeue();

                let quiz;
                const activeQuizzes = await this.quizRepository.getActiveQuizzes();

                if (activeQuizzes.length > 0) {
                    quiz = activeQuizzes[0];
                    quiz.locked = true;
                    quiz.players.push(user1, user2);
                    await quiz.save();
                } else {
                    quiz = await this.quizRepository.createQuiz(no_of_questions);
                    quiz.players.push(user1, user2);
                    
                    if (!quiz.attemptedBy.includes(user1)) {
                        quiz.attemptedBy.push(user1);
                    }
                    
                    if (!quiz.attemptedBy.includes(user2)) {
                        quiz.attemptedBy.push(user2);
                    }

                    quiz.locked = true;
                    await quiz.save();
                }

                // Notify users about the new quiz
                pusher.trigger('quiz', 'new-quiz', {
                    quiz,
                    status: 'ready',
                });

                res.status(201).json({
                    status: 'ready to start',
                    quiz,
                });
            } else {
                res.status(200).json({
                    status: 'waiting',
                    message: 'Waiting for more players to join.',
                });
            }
        } catch (err) {
            console.error('Error creating quiz:', err);
            res.status(500).json({
                status: false,
                message: 'Failed to create quiz. Please try again.',
                error: err.message,
            });
        }
    }

    async getQuizById(req, res) {
        const quizId = req.params.quizId;
        try {
            const quiz = await this.quizRepository.getQuizById(quizId);
            res.status(200).json({
                status: true,
                quiz,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve quiz',
                error: err.message,
            });
        }
    }

    async getAllQuizzes(req, res) {
        try {
            const quizzes = await this.quizRepository.getAllQuizzes();
            res.status(200).json({
                status: true,
                quizzes,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve quizzes',
                error: err.message,
            });
        }
    }

    async getActiveQuizzes(req, res) {
        try {
            const activeQuizzes = await this.quizRepository.getActiveQuizzes();
            res.status(200).json({
                status: true,
                quizzes: activeQuizzes,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to retrieve active quizzes',
                error: err.message,
            });
        }
    }

    async updateAttemptedBy(req,res){
        const {userId, quizId} = req.body;
        try{
            const updatedQuiz = await this.quizRepository.updateAttemptedBy(userId, quizId);
            res.status(201).json({
                status: true,
                msg: 'Updated attempted by in quiz',
                quiz: updatedQuiz,
            })
        }catch(err){
            res.status(500).json({
                status: false,
                message: 'Failed to update attempted by in quiz',
                error: err.message,
            });
        }
    }

    async deleteQuizById(req, res) {
        const quizId = req.params.quizId;
        try {
            const deletedQuiz = await this.quizRepository.deleteQuizById(quizId);
            res.status(201).json({
                status: true,
                quiz: deletedQuiz,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Failed to delete quiz',
                error: err.message,
            });
        }
    }

    async updateScore(req,res){
        const {quizId, userId, score} = req.body;
        try{
            const quiz = await this.quizRepository.updateScore(quizId, userId, score);
            res.status(201).json({
                status: true,
                message: 'Score updated successfully',
                quiz
            })
        }catch(err){
            res.status(500).json({
                status: false,
                message: 'Failed to update score',
                error: err.message,
            });
        }
    }

    async warnEnding(req,res){
        const {quizId, userId} = req.body;
        pusher.trigger(`quiz-${quizId}`,'end-quiz',{
            quizId,
            userId
        });
        res.status(200).json({
            status: true,
            msg: 'Warn ending quiz'
        })
    }

    async endQuiz(req,res){
        const {quizId, userId} = req.body;
        try{
            const quiz = await this.quizRepository.updateHighestScore(quizId);

            const playerId1 = quiz.players[0];
            const playerId2 = quiz.players[1];

            await this.userRepository.updateTotalScore(playerId1, quiz.scores[0]);
            await this.userRepository.updateTotalScore(playerId2, quiz.scores[1]);

            await this.userRepository.updateGamesPlayed(playerId1);
            await this.userRepository.updateGamesPlayed(playerId2);

            if(quiz.scores[0]>quiz.scores[1]){
                await this.userRepository.updateGamesWon(playerId1);
            }else if(quiz.scores[0]<quiz.scores[1]){
                await this.userRepository.updateGamesWon(playerId2);
            }

            res.status(200).json({
                status: true,
                msg: 'End quiz',
                quiz
            })
        }catch(err){
            res.status(500).json({
                status: false,
                message: 'Failed to update highest score',
                error: err.message,
            });
        }
    }
}
