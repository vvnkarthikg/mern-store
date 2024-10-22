// App.js
import React from 'react';
import Products from './components/Pages/Products';
import Navbar from './components/Navbar';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Auth from './components/Authentication/Auth';
import ProductDetails from './components/Pages/ProductDetails';
import UserOrders from './components/Pages/UserOrders';
import UserProfile from './components/Pages/UserProfile';
import AddProduct from './components/Pages/AddProduct';
import Footer from './components/Pages/Footer';


function App() {
  return (
    <>
    
    <Router>
    <Navbar />
      <Routes>
      <Route path="/" element={<Products />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
      <Footer />
    </Router>
    
    </>
    
  );
}

export default App;