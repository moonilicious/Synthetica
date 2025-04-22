import React from 'react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import Navbar from './Navbar'; 
import './Pricing.css'; 
import './Navbar.css';
import freeImage from './FREE.webp';
import preImage from './PRE.webp';
import eduImage from './EDU.webp';
import freetImage from './FREET.webp';
import pretImage from './PRET.webp';
import edutImage from './EDUT.webp';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <Navbar />
      <div className="pricing-content">
        <div className="pricing-item">
          <motion.img
            src={freeImage}
            alt="Free Plan"
            className="pricing-image"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.button
            className="image-button"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={freetImage} alt="Free Plan Button" />
          </motion.button>
        </div>
        <div className="pricing-item">
          <motion.img
            src={preImage}
            alt="Premium Plan"
            className="pricing-image"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.button
            className="image-button"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={pretImage} alt="Premium Plan Button" />
          </motion.button>
        </div>
        <div className="pricing-item">
          <motion.img
            src={eduImage}
            alt="Education Plan"
            className="pricing-image"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.button
            className="image-button"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness:300 }}
          >
            <img src={edutImage} alt="Education Plan Button" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
