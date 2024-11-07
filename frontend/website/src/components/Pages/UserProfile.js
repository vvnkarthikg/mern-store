import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload'; 
import './UserProfile.css';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [storeName, setStoreName] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [address, setAddress] = useState({
        DoorNumber: '',
        street: '',
        landmark: '',
        area: '',
        mandal: '',
        district: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setPhone(response.data.phone);
                setStoreName(response.data.storeName);
                setGstNumber(response.data.gstNumber);
                if (response.data.address) {
                    setAddress(response.data.address);
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleImageChange = (file) => {
        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('phone', phone);
            formData.append('storeName', storeName);
            formData.append('gstNumber', gstNumber);
            formData.append('address', JSON.stringify(address));
            if (selectedFile) formData.append('profilePicture', selectedFile);

            await axios.patch(`${process.env.REACT_APP_API_URL}/user/`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                <ImageUpload onImageChange={handleImageChange} />
                <form onSubmit={handleSubmit}>
                    <h3>Personal Details</h3>
                    <div>
                        <label>First Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        ) : (
                            <span>{firstName || "Please fill this"}</span>
                        )}
                    </div>
                    <div>
                        <label>Last Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        ) : (
                            <span>{lastName || "Please fill this"}</span>
                        )}
                    </div>
                    <div>
                        <label>Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        ) : (
                            <span>{phone || "Please fill this"}</span>
                        )}
                    </div>

                    <h3>Store Details</h3>
                    <div>
                        <label>Store Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        ) : (
                            <span>{storeName || "Please fill this"}</span>
                        )}
                    </div>
                    <div>
                        <label>GST Number</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
                            />
                        ) : (
                            <span>{gstNumber || "Please fill this"}</span>
                        )}
                    </div>

                    <h3>Address</h3>
                    <div>
                        {Object.entries(address).map(([key, value]) => (
                            <div key={key}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                                    />
                                ) : (
                                    <span>{value || "Please fill this"}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        {isEditing ? (
                            <button type="submit">Save Changes</button>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
