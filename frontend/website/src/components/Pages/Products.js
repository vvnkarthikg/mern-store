import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Products.css';
import no from '../images/no.jpg';
import bannerImage from '../images/minibanner1.png'; // Import the banner image

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

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
