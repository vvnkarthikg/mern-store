import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const handleImageChange = (e) => {
    console.log('Image selected:', e.target.files[0]); // Log selected image
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    console.log('Form submitted with values:', { name, price, quantity, category }); // Log form values

    // Create a FormData object to send the image along with other data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (quantity) formData.append('quantity', quantity); // Only append if quantity is provided
    if (category) formData.append('category', category); // Only append if category is provided
    if (productImage) {
      formData.append('productImage', productImage);
      console.log('Product image added to FormData:', productImage.name); // Log image name
    }

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in local storage
      console.log('Token retrieved:', token); // Log retrieved token
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response received:', response.data); // Log response data
      setMessage(response.data.message || 'Product added successfully!');
      
      // Reset the form fields
      setName('');
      setPrice('');
      setQuantity(0);
      setCategory('');
      setProductImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error response:', error.response?.data); // Log error response data
      setMessage(error.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="addproduct-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Price:</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            min="0" // Ensure price is non-negative
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            min="0" // Ensure quantity is non-negative
          />
        </div>
        <div>
          <label>Category:</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </div>
        <div>
          <label>Product Image:</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleImageChange} 
          />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button> {/* Disable button while loading */}
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;