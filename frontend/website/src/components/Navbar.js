import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import logo from './images/logo.png';

const Navbar = ({ products }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter products based on the search term
    if (term) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]); // Clear results if search is cleared
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the product details page
    setSearchTerm(''); // Clear the search bar
    setFilteredProducts([]); // Clear the search results
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="Logo" />
          <p className="navbar-title">SRI GANESH AGENCIES</p>
        </div>
        <form className="search-container">
          <input 
            type="text" 
            placeholder="Search " 
            className="search-input" 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          {/* Display the filtered products based on search */}
          {filteredProducts.length > 0 && (
            <div className="search-results">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="search-item"
                  onClick={() => handleProductClick(product.productId)}  // Handle redirection on click
                  style={{ cursor: 'pointer' }}
                >
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
          )}
        </form>
        <ul className="navbar-links">
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><a href="/orders"><FaShoppingCart /> Orders</a></li>
          {isAdmin && (
            <li><Link to="/add-product"><FaUser /> Add Product</Link></li>
          )}
          {token ? (
            <li>
              <FaUserCircle onClick={() => setOverlayVisible(!isOverlayVisible)} style={{ cursor: 'pointer' }} />
              {isOverlayVisible && (
                <div className="overlay">
                  <ul>
                    <li><Link to="/profile"><FaUser /> Profile</Link></li>
                    <li><a href="/" onClick={handleLogout}><FaSignOutAlt /> Logout</a></li>
                  </ul>
                </div>
              )}
            </li>
          ) : (
            <li><Link to="/auth"><FaSignInAlt /> Login</Link></li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
