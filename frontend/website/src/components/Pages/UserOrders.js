import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserOrders.css';
import noImage from '../images/no.jpg'; // Placeholder image for products

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if user is admin

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    const confirmLogin = window.confirm("Please log in to view your orders.");
                    if (confirmLogin) {
                        navigate('/auth'); // Redirect to login if confirmed
                    }
                    return; // Exit the function if no token
                }

                // Fetch all orders if user is admin, otherwise fetch only user's orders
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/${isAdmin ? '' : 'my-orders'}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders); // Adjusted to match the response structure
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate, isAdmin]);

    if (loading) return <p className="order-loading">Loading...</p>;
    if (error) return <p className="order-error">{error}</p>;

    return (
        <div className="order-container">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => (
                        <li key={order.id} className="order-item">
                            <img 
                                src={order.product.productImage && order.product.productImage !== "" 
                                    ? `${process.env.REACT_APP_API_URL}/${order.product.productImage}` 
                                    : noImage} 
                                alt={order.product.name} 
                                className="order-item-image" 
                            />
                            <div className="order-item-details">
                                <span className="order-item-name">{order.product.name}</span>
                                <span className="order-item-quantity">Quantity: {order.quantity}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserOrders;