import React from 'react';
import { motion } from 'framer-motion';
import Model1 from './MODEL1.webp'; // Replace with your actual model image paths
import Model2 from './MODEL2.webp';
import Model3 from './MODEL3.webp';
import Features from './features.webp';
import './Model.css'; // Replace with your CSS file for styling

const ModelComponent = () => {
  return (
    <div className="model-gallery">
      <motion.div
        className="features-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={Features}
          alt="Features"
          className="features-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="model-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={Model1}
          alt="Model 1"
          className="model-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="model-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={Model2}
          alt="Model 2"
          className="model-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="model-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={Model3}
          alt="Model 3"
          className="model-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
};

export default ModelComponent;
