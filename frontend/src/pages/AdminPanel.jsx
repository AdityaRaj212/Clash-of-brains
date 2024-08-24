import { useEffect, useState } from 'react';
import styles from './AdminPanel.module.css';
import Pusher from 'pusher-js';

import Button from 'react-bootstrap/Button';
import QuestionShowcase from '../components/QuestionShowcase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [option, setOption] = useState(0);

    // const switchToQuestions = () => {
    //     setOption(0);
    // };

    // const switchToQuizzes = () => {
    //     setOption(1);
    // };

    const handleAddQuestion = () => {
        navigate('/create-question');
    }

    const handleSwitchToUser = () => {
        navigate('/user-panel');
    }

    useEffect(() => {
        const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
            cluster: "ap2"
        });
        // const pusher = new Pusher("9ab1a8af120cfd1dbc4f", {
        //     cluster: "ap2"
        // });

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
                        <Button variant={option === 0 ? "primary" : "outline-primary"} onClick={handleAddQuestion}>
                            Add Questions
                        </Button>
                    </div>
                </div>

                <div className={styles.mainContainer}>
                    <div className={styles.usersOnline}>
                        <Button variant='primary' onClick={handleSwitchToUser}>
                            Switch to User
                        </Button>
                        {/* <h3>Users Online: 5</h3> */}
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
