import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import CSS for styling
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Import icons
import logo from './images/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if user is admin
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin'); // Clear admin status on logout
        navigate('/auth');
    };

    const handleOrdersClick = (e) => {
        e.preventDefault();
        if (!token) {
            alert('Please log in to view your orders.');
            navigate('/auth');
        } else {
            navigate('/orders');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Logo" />
                <p className="navbar-title">SRI GANESH AGENCIES</p>
            </div>
            <form className="search-container">
                <input type="text" placeholder="Search..." className="search-input" />
                <button type="submit" className="search-button"><FaSearch /></button>
            </form>
            <ul className="navbar-links">
                <li><Link to="/"><FaHome /> Home</Link></li>
                <li><a href="/orders" onClick={handleOrdersClick}><FaShoppingCart /> Orders</a></li>
                {isAdmin && ( 
                    <li><Link to="/add-product"><FaUser /> Add Product</Link></li> 
                )}
                {token ? (
                    <>
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
                    </>
                ) : (
                    <li><Link to="/auth"><FaSignInAlt /> Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;