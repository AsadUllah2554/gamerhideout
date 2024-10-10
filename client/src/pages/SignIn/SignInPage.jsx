import React, { useState } from 'react';
import './SignInPage.css';
import axios from 'axios';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignInPage = () => {

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const google = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
       
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('response:', response);

      if (response.data.success) {
        setUser(response.data.user);
        navigate('/');
      } else {
        toast.error(isSignUp ? 'Signup failed: ' : 'Signin failed: ' + response.data.message);
      }
    } catch (error) {
      toast.error(isSignUp ? 'Error in signup: ' : 'Error in signin: ' + error.message);
    }
  };

  return (
    <div className="signin-page">
      <div className="header">
        <h1 className="title">Connect</h1>
      </div>
 
        <div className="content">
          <p className="welcome-text">Welcome to Connect! Join our community today.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="submit-button">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
          <div className="divider">
            <span>OR</span>
          </div>
          <button className="google-button" onClick={google}>
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google icon" />
            Sign in with Google
          </button>
        </div>
    </div>
  );
};

export default SignInPage;