import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import TextDetector from './TextDetector';
import EssayDetector from './EssayDetector';
import PoemDetector from './PoemDetector';
import About from './About';
import Pricing from './Pricing';
import Signup from './Signup';
import Login from './Login';
import PublicHistory from './PublicHistory';
import PrivateRoute from './PrivateRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import History from './History';
import Educator from './Educator';
import MobileHistory from './MobileHistory';
import Gemini from './Gemini';

const App = () => {
  const [userName, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const usersCollectionRef = collection(db, "users");
        try {
          const q = query(usersCollectionRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username);
          });
        } catch (error) {
          console.error("Error fetching user documents:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/text-detector" element={<PrivateRoute element={TextDetector} />} />
        <Route path="/essay-detector" element={<PrivateRoute element={EssayDetector} />} />
        <Route path="/poem-detector" element={<PrivateRoute element={PoemDetector} />} />
        <Route path="/pricing" element={<PrivateRoute element={Pricing} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Educator" element={<Educator />} />
        <Route path="/token/:username?/:tokenid?" element={<PublicHistory />} />
        <Route path="/history" element={<MobileHistory username={userName} visible={true} />} />
        <Route path="/gemini" element={<Gemini />} />
      </Routes>
    </Router>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
