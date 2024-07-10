import QuizRepository from "./quiz.repository.js";
import matchMakingQueue from './../../config/queue.js';
import pusher from "../../config/pusher.js";

export default class QuizController {
    constructor() {
        this.quizRepository = new QuizRepository();
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

                // if (activeQuizzes.length > 0) {
                //     quiz = activeQuizzes[0];
                //     quiz.locked = true;
                //     quiz.players.push(user1, user2);
                //     await quiz.save();
                // } else {
                    quiz = await this.quizRepository.createQuiz(no_of_questions);
                    quiz.players.push(user1, user2);
                    quiz.locked = true;
                    await quiz.save();
                // }

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

    endQuiz(req,res){
        const {quizId, userId} = req.body;
        pusher.trigger(`quiz-${quizId}`,'end-quiz',{
            quizId,
            userId
        });
        res.status(200).json({
            status: true,
            msg: 'End quiz'
        })
    }
}
