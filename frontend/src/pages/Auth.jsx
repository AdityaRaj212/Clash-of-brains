import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import Alert from 'react-bootstrap/Alert';


const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn />}
        <div className={styles.authToggle}>
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={handleToggle} className={styles.authToggleButton}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUp = ({ setIsSignUp }) => {
  const [error, setError] = useState(false);

  const {signUp} = useContext(AuthContext);

  const [form, setForm] = useState({
    userName: '',
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    // try{
    //   const response = await axios.post('/api/users/signUp',{name: form.name, userName: form.userName, email: form.email, password: form.password});
    //   console.log(response);
    //   // setIsSignUp(false);
    // }catch(err){
    //   console.log('Error while signing up user: ' + err);
    // }
    const result = await signUp(form.name, form.userName, form.email, form.password);
    if(result.success){
      setError(false);
      setIsSignUp(false);
    }else{
      setError(true);
    }
    console.log('SignUp Form submitted:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>User Name</label>
        <input
          type="text"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.authButton}>Sign Up</button>
    </form>
  );
};

const SignIn = () => {
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(false);
  const {signIn} = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    // try{
    //   const response = await axios.post('/api/users/signIn',{
    //     email: form.email,
    //     password: form.password
    //   });
    //   changeAuthState();
    // }catch(err){
    //   console.log('Error while signing up: ' + err);
    // }
    const result = await signIn(form.email, form.password);
    console.log(result);
    if(result.success){
      setLoginError(false);
      navigate('/admin-panel');
      // how to redirect to admin page after log in 
    }else{
      setLoginError(true);
    }
    
    console.log('SignIn Form submitted:', form);
  };

  return (
    <>
    {
      (loginError)
      &&
      (
        <Alert variant='danger'>
          Invalid Credentials 
        </Alert>
      )
    }
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.authButton}>Sign In</button>
    </form>
    </>
  );
};

export default Auth;
