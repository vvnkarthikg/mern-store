// components/UserOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserOrders.css'; // Import the CSS file for styles

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/`, {
                    headers: { Authorization: `Bearer ${token}` } // Set authorization header
                });
                setOrders(response.data.orders); // Set orders in state
                console.log(response.data)
            } catch (err) {
                setError('Failed to fetch orders'); // Handle error fetching orders
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        fetchOrders(); // Call function to fetch orders when component mounts
    }, []);

    if (loading) return <p className="loading">Loading...</p>; // Show loading state while fetching data
    if (error) return <p className="error">{error} Orders:odkd</p>; // Show error message if fetching fails

    return (
        <div className="orders-container">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p> // Message if no orders are available
            ) : (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order._id} className="order-item">
                            <span className="item-name">{order.product.name}</span>
                            <span className="item-details">Quantity: {order.quantity}</span>
                            <span className="item-order-number">Order Number: {order.orderNumber}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserOrders;