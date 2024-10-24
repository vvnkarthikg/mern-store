import React from 'react';
import { Link } from 'react-router-dom'; 
import './Products.css';
import no from '../images/no.jpg';
import bannerImage from '../images/minibanner3.png'; // Import the banner image

const Products = ({ products, error }) => {
  return (
    <>
      <div className="banner-image">
        <img src={bannerImage} alt="Banner" className="banner-img" />
      </div>

      <div className="home-container">
        {error && <p className="error-text">{error}</p>}
        
        <div className="prod-list">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map(product => (
              <Link key={product._id} to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                <div className="prod-card">
                  <div className="prod-image">
                    <img
                      src={product.productImage && product.productImage !== "" ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no}
                      alt={product.name}
                    />
                  </div>
                  <div className="prod-details">
                    <h3>{product.name}</h3>
                    <p className="prod-price">₹{product.price}</p>
                    <p className="prod-quantity">{product.quantity} left</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
