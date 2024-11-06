import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [description, setDescription] = useState(''); // New state for description
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [imagePreview, setImagePreview] = useState(''); // State for image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image selected:', file); // Log selected image
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    console.log('Form submitted with values:', { name, price, quantity, category, description }); // Log form values

    // Create a FormData object to send the image along with other data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (quantity) formData.append('quantity', quantity); // Only append if quantity is provided
    if (category) formData.append('category', category); // Only append if category is provided
    if (description) formData.append('description', description); // Append description
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
      setDescription(''); // Reset description field
      setProductImage(null);
      setImagePreview(''); // Reset image preview
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
      <div className="form-layout">
        <div className="upload-section">
          {/* Displaying Image Preview or Placeholder */}
          {!imagePreview ? (
            <div className="image-placeholder"><p>Your picture goes here</p></div>
          ) : (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
          <label htmlFor="file-upload" className="custom-file-upload">
            Upload Image
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleImageChange} 
            className="file-input" /* Custom class for styling */
          />
        </div>
        <form onSubmit={handleSubmit} className="details-section">
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
              className="quantity-input" // Add custom class here for styling if needed
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
            <label>Description:</label> {/* New Description Field */}
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4" /* Adjust rows for better visibility */
              required /* Optional: make it required based on your needs */
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button> {/* Disable button while loading */}
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;