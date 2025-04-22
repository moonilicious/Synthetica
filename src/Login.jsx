import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';
import LOGOB from './LOGB.webp';
import LOGB1 from './LOGB1.webp';
import LOG from './LOG.webp';
import ALLBOX from './ALLBOX.webp';
import GOOGLE_ICON from './google-icon-logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in successfully:', user.uid);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign-in successful:', user.uid);
      navigate('/');
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="login-bg" style={{ backgroundImage: `url(${LOGOB})` }}>
      <motion.div
        className="login-container"
        style={{ backgroundImage: `url(${LOGB1})` }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={LOG}
          alt="Login"
          className="login-title"
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.button
          type="button" // Specify type
          className="login-button-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={handleLogin}
        >
          Login
        </motion.button>
        <motion.button
          type="button" // Specify type
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <img
            src={GOOGLE_ICON}
            alt="Google sign-in"
            className="google-icon"
          />
          Sign in with Google
        </motion.button>
        {error && (
          <motion.p
            className="login-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {error}
          </motion.p>
        )}
        <div className="login-signup-link">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            Don't have an account? <Link to="/signup">Sign up</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
