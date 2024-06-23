import { useState } from 'react';
import styles from './AdminPanel.module.css';

import Button from 'react-bootstrap/Button';

const AdminPanel = () => {
    const [option, setOption] = useState(0);

    const switchToQuestions = () => {
        setOption(0);
    }

    const switchToQuizzes = () => {
        setOption(1);
    }

    return (
        <>
            <div className={styles.container}>

                <div className={styles.header}>

                    <div className={styles.logo}>

                    </div>

                    <div className={styles.options}>
                        <Button variant="primary" onClick={switchToQuestions}>
                            Questions
                        </Button>
                        <Button variant="primary" onClick={switchToQuizzes}>
                            Quizzes
                        </Button>
                    </div>

                </div>

                <div className={styles.mainContainer}>

                    <div className={styles.usersOnline}>

                    </div>

                    <div className={styles.content}>

                    </div>

                </div>
            </div>
        </>
    )
};

export default AdminPanel;