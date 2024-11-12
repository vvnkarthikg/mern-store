import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuantityModal from './QuantityModal'; // Import the QuantityModal component
import './ProductDetails.css'; // Import the CSS file for styles
import no from '../images/no.jpg';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State variables for modal visibility and quantity input
    const [showModal, setShowModal] = useState(false);
    const [quantityInputValue, setQuantityInputValue] = useState(1);

    // State variables for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedQuantity, setEditedQuantity] = useState(0);
    const [editedCategory, setEditedCategory] = useState('');
    const [editedDescription, setEditedDescription] = useState(''); // New state for description

    const navigate = useNavigate(); // Initialize navigate

    // Fetch product details
    const fetchProduct = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}`);
            setProduct(response.data);
            // Set initial edited values
            setEditedName(response.data.name);
            setEditedPrice(response.data.price);
            setEditedQuantity(response.data.quantity);
            setEditedCategory(response.data.category);
            setEditedDescription(response.data.description); // Set initial description
        } catch (err) {
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    }, [productId]); // Add productId as a dependency

    useEffect(() => {
        fetchProduct(); // Call fetchProduct on mount
    }, [fetchProduct]); // Include fetchProduct in dependencies

    const handleOrderNow = () => {
        const token = localStorage.getItem('token'); // Check if user is logged in
        if (!token) {
            alert('Please log in to place an order.'); // Alert if not logged in
            navigate('/auth'); // Redirect to login page
        } else {
            setShowModal(true); // Open modal if logged in
        }
    };

    const handleQuantityConfirm = async (quantity) => {
        try {
            const token = localStorage.getItem('token'); // Get token from local storage
            await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, { quantity, id: product._id }, {
                headers: { Authorization: `Bearer ${token}` } // Set authorization header
            });
            alert('Order placed successfully!'); // Show success message
            navigate('/orders'); // Redirect to orders page
        } catch (err) {
            alert('Failed to place order. Please try again.');
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from local storage
            await axios.patch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                name: editedName,
                price: editedPrice,
                quantity: editedQuantity,
                category: editedCategory,
                description: editedDescription, // Include updated description
            }, {
                headers: { Authorization: `Bearer ${token}` } // Set authorization header
            });
            alert('Product updated successfully!');
            setIsEditing(false); // Exit edit mode after saving changes
            
            // Fetch updated product data
            await fetchProduct();  // Refresh product data after editing
        } catch (err) {
            alert('Failed to update product. Please try again.');
        }
    };

    const handleDelete = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this product?');
        if (confirmation) {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` } // Set authorization header
                });
                alert('Product deleted successfully!');
                navigate('/products'); // Redirect to the products list page after deletion
            } catch (err) {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <div className="product-details">
            {product ? (
                <div className="product-layout">
                    <img    
                     src={product.productImage ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no} 
 alt={product.name} className="product-image" />
                    <div className="product-info">
                        <h1 className="product-name">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={editedName} 
                                    onChange={(e) => setEditedName(e.target.value)} 
                                />
                            ) : (
                                product.name
                            )}
                        </h1>
                        <p className="product-price">
                            ₹{isEditing ? (
                                <input 
                                    type="number" 
                                    value={editedPrice} 
                                    onChange={(e) => setEditedPrice(e.target.value)} 
                                    min="0"
                                />
                            ) : (
                                product.price
                            )}
                        </p>
                        <p className="product-quantity">
                            Available: {isEditing ? (
                                <input 
                                    type="number" 
                                    value={editedQuantity} 
                                    onChange={(e) => setEditedQuantity(e.target.value)} 
                                    min="0"
                                />
                            ) : (
                                product.quantity
                            )}
                        </p>
                        <p className="product-category">
                            Category: {isEditing ? (
                                <input 
                                    type="text" 
                                    value={editedCategory} 
                                    onChange={(e) => setEditedCategory(e.target.value)} 
                                />
                            ) : (
                                product.category
                            )}
                        </p>
                        <div className="product-description">
                            <h3>Description</h3>
                            {isEditing ? (
                                <textarea 
                                    value={editedDescription} 
                                    onChange={(e) => setEditedDescription(e.target.value)} 
                                />
                            ) : (
                                <p>{product.description}</p>
                            )}
                        </div>
                        {/* Conditionally render Order Now and Edit buttons based on user role */}
                        {!isAdmin && (
                            <button className="buy-now" onClick={handleOrderNow}>Order Now</button>
                        )}
                        {isAdmin && (
                            isEditing ? (
                                <>
                                    <button onClick={handleSaveChanges}>Save Changes</button>
                                    <button onClick={handleEditToggle} className="cancel-edit">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleEditToggle}>Edit</button>
                                    <button onClick={handleDelete} className="delete-button">Delete</button>
                                </>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <p>No product details available.</p>
            )}

            {/* Render the quantity modal */}
            <QuantityModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                onConfirm={handleQuantityConfirm} 
                quantityInputValue={quantityInputValue}
                setQuantityInputValue={setQuantityInputValue}
            />
        </div>
    );
};

export default ProductDetails;
