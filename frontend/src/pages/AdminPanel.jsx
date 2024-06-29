import { useEffect, useState } from 'react';
import styles from './AdminPanel.module.css';
import Pusher from 'pusher-js';

import Button from 'react-bootstrap/Button';
import QuestionShowcase from '../components/QuestionShowcase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
    const [option, setOption] = useState(0);

    const switchToQuestions = () => {
        setOption(0);
    };

    const switchToQuizzes = () => {
        setOption(1);
    };

    useEffect(() => {
        const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
            cluster: "ap2"
        });

        const channel = pusher.subscribe('questions');
        channel.bind('new-question', (data) => {
            toast.success('A new question has been added');
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            // pusher.disconnect();
        };
    }, []);

    return (
        <>
            <div className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.logo}>
                        <h1>Admin Panel</h1>
                    </div>

                    <div className={styles.options}>
                        <Button variant={option === 0 ? "primary" : "outline-primary"} onClick={switchToQuestions}>
                            Questions
                        </Button>
                        <Button variant={option === 1 ? "primary" : "outline-primary"} onClick={switchToQuizzes}>
                            Quizzes
                        </Button>
                    </div>
                </div>

                <div className={styles.mainContainer}>
                    <div className={styles.usersOnline}>
                        <h3>Users Online: 5</h3>
                    </div>

                    <div className={styles.content}>
                        <QuestionShowcase />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default AdminPanel;
