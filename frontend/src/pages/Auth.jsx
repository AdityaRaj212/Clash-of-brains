import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => setIsSignUp(!isSignUp);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-pink-100 to-yellow-100 px-2 py-8">
      <div className="w-full max-w-md bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-blue-100 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-center tracking-tight mb-2 drop-shadow-lg">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn />}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={handleToggle}
              className="ml-2 font-bold text-blue-500 hover:text-pink-500 transition"
            >
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
  const { signUp } = useContext(AuthContext);

  const [form, setForm] = useState({
    userName: '',
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp(form.name, form.userName, form.email, form.password);
    if (result.success) {
      setError(false);
      setIsSignUp(false);
    } else {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center font-semibold">
          Registration failed. Please try again.
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">User Name</label>
        <input
          type="text"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:scale-105 transition"
      >
        Sign Up
      </button>
    </form>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const { signIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(form.email, form.password, form.role);
    if (result.success) {
      setLoginError(false);
      navigate(form.role === 'admin' ? '/admin-panel' : '/user-panel');
    } else {
      setLoginError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {loginError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center font-semibold">
          Invalid Credentials
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border-2 border-blue-200 bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Sign in as:</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-blue-600 font-semibold">
            <input
              type="radio"
              name="role"
              value="user"
              checked={form.role === 'user'}
              onChange={handleRoleChange}
              className="accent-blue-500"
            />
            User
          </label>
          <label className="flex items-center gap-2 text-pink-600 font-semibold">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={form.role === 'admin'}
              onChange={handleRoleChange}
              className="accent-pink-500"
            />
            Admin
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:scale-105 transition"
      >
        Sign In
      </button>
    </form>
  );
};

export default Auth;
