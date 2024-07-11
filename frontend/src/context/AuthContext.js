import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../pages/Loading";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('userInfo'));
            setIsAuthenticated(true);
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const signIn = async (email, password) => {
        try {
            const response = await axios.post('/api/users/signIn', { email, password });
            const { user, token } = response.data; // Assuming the response contains both user and token
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userInfo', JSON.stringify(user));
            setIsAuthenticated(true);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.response?.data?.msg || 'Login failed' };
        }
    };

    const signOut = async () => {
        try {
            const response = await axios.put(`/api/users/signOut/${user._id}`);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userInfo');
            setIsAuthenticated(false);
            setUser(null);
            return { success: true };
        } catch (err) {
            console.log('Logout error: ' + err);
            return { success: false, message: err.response?.data?.msg || 'Logout failed' };
        }
    };

    const signUp = async (name, userName, email, password) => {
        try {
            const response = await axios.post('/api/users/signUp', { name, userName, email, password });
            const { user } = response.data;
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: error.response?.data?.msg || 'Signup failed' };
        }
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
