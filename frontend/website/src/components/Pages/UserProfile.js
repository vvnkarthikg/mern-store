import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Import CSS for styling

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` } // Set authorization header
                });
                setUser(response.data); // Set user data
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setPhone(response.data.phone);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.REACT_APP_API_URL}/user/`, {
                email: user.email, // Keep email unchanged
                updateFields: {
                    firstName,
                    lastName,
                    phone
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully!');
            setIsEditing(false); // Exit edit mode after successful update
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly // Make email read-only
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="submit-btn">Update Profile</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>First Name:</strong> {firstName}</p>
                    <p><strong>Last Name:</strong> {lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {phone}</p>
                    <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;