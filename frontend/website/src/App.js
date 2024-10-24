import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/Pages/Products';
import Navbar from './components/Navbar';
import Auth from './components/Authentication/Auth';
import ProductDetails from './components/Pages/ProductDetails';
import UserOrders from './components/Pages/UserOrders';
import UserProfile from './components/Pages/UserProfile';
import AddProduct from './components/Pages/AddProduct';
import Footer from './components/Pages/Footer';
import axios from 'axios'; // Import axios for fetching data
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Fetch the products in App.js
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
    <div className="wrapper">
      <Router>
        {/* Pass products as props to Navbar */}
        <Navbar products={products} />
        <div className="main-content">
          <Routes>
            {/* Pass products as props to Products */}
            <Route path="/" element={<Products products={products} error={error} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
