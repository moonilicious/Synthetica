import React from 'react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import Navbar from './Navbar'; // Import your Navbar component
import LeftImage from './left.webp'; // Import left image
import RightImage from './right.webp'; // Import right image
import SyntheticaImage from './SYNTHETICA.webp'; // Import synthetica image
import DetectiveImage from './Detective.webp'; // Import detective image
import About from './About'; // Import About component
import Bottom from './Bottom';
import './Home.css'; // Import CSS file for styling if needed
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Rectangle19 from './Rectangle 19.webp'; // Import the rectangle19 image
import Footer from './Footer';
import Model from './Model'
const Home = () => {
  const navigate = useNavigate();

  const handleTryus = () => {
    if (auth.currentUser) {
      navigate(`/essay-detector`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main>
        <section className="main-content">
          <div className="synthetica-container">
            {/* Wrap the synthetica image in a motion component */}
            <motion.img
              src={SyntheticaImage}
              alt="Synthetica Image"
              className="synthetica-image"
              initial={{ opacity: 0, scale: 0.5 }} // Initial animation properties
              animate={{ opacity: 1, scale: 1 }} // Animation properties on load
              transition={{ duration: 0.5 }} // Animation duration
            />
          </div>

          <div className="detective-container">
            <motion.img
              src={DetectiveImage}
              alt="Detective Image"
              className="detective-image"
              initial={{ opacity: 0, y: -50 }} // Initial animation properties
              animate={{ opacity: 1, y: 0 }} // Animation properties on load
              transition={{ duration: 0.5, delay: 0.6 }} // Animation duration and delay
            />
            <motion.div
              className="try-us-button"
              initial={{ opacity: 0, y: 50 }} // Initial animation properties
              animate={{ opacity: 1, y: 0 }} // Animation properties on load
              transition={{ duration: 0.5, delay: 0.8 }} // Animation duration and delay
              onClick={handleTryus}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <img src={Rectangle19} alt="Try Synthetica" className="rectangle-image" />
              <div className="try-us-text">
                TRY SYNTHETICA <LaunchIcon className="launch-icon" />
              </div>
            </motion.div>
          </div>

          <div className="left-content">
            <motion.img
              src={LeftImage}
              alt="Left Image"
              initial={{ opacity: 0, x: -50 }} // Initial animation properties
              animate={{ opacity: 1, x: 0 }} // Animation properties on load
              transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
            />
          </div>

          <div className="right-content">
            <motion.img
              src={RightImage}
              alt="Right Image"
              initial={{ opacity: 0, x: 50 }} // Initial animation properties
              animate={{ opacity: 1, x: 0 }} // Animation properties on load
              transition={{ duration: 0.5, delay: 0.4 }} // Animation duration and delay
            />
          </div>

          {/* Use the About component */}
        </section>
        <section className='about-us'>
          <About />
        </section>
        <section className='models'>
          <Model />
        </section>
        <section className='footer'>
          <Footer />
        </section>
      </main>
    </div>
  );
}

export default Home;
