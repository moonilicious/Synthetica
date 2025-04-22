import React from 'react';
import './Product.css'; // Importing CSS file for styling
import MB1Image from './MB1.webp';
import MB2Image from './MB2.webp';
import MB3Image from './MB3.webp';
import PM1Image from './PM1.webp';
import PM2Image from './PM2.webp';
import PM3Image from './PM3.webp';

const Product = () => {
  return (
    <div className="product-container">
      <div className="image-overlay">
        <div className="image-row-top">
          <img src={MB1Image} alt="MB1" className="small-img" />
          <img src={MB2Image} alt="MB2" className="small-img" />
          <img src={MB3Image} alt="MB3" className="small-img" />
        </div>
      </div>
      <div className="phone-view">
        <div className="phone-image-column">
          <img src={PM1Image} alt="PM1" className="phone-small-img" />
          <img src={PM2Image} alt="PM2" className="phone-small-img" />
          <img src={PM3Image} alt="PM3" className="phone-small-img" />
        </div>
      </div>
    </div>
  );
}

export default Product;
