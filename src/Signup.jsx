import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './SignUp.css';
import LOGOB from './LOGB.webp';
import LOGB1 from './LOGB1.webp';
import SIGN from './SIGN.webp';
import SIGN5 from './SIGN5.webp';
import ALLBOX from './ALLBOX.webp';
import GOOGLE_ICON from './google-icon-logo.svg';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // ...
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in with Google:', user.uid);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-bg">
      <motion.div
        className="signup-container"
        style={{ backgroundImage: `url(${LOGB1})` }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={SIGN}
          alt="Sign Up"
          className="signup-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="signup-input"
          whileFocus={{ scale: 1.05 }}
          style={{ backgroundImage: `url(${ALLBOX})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
        <motion.button
          className="signup-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          onClick={handleSignUp}
        >
          <img
            src={SIGN5}
            alt="Sign Up Button"
            className="signup-button-image"
          />
        </motion.button>
        {error && (
          <motion.p
            className="signup-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
        >
          {error}
        </motion.p>
        )}
        <motion.button
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <img
            src={GOOGLE_ICON}
            alt="Google sign-in"
            className="google-icon"
          />
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SignUp;


