import { useContext } from 'react';
import styles from './WaitingPage.module.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WaitingPage = ()=>{
    const {isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    if(!isAuthenticated){
        navigate('/authentication');
    }
    return (
        <div className={styles.container}>
            Welcome
        </div>
    )
};

export default WaitingPage;