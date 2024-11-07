import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload'; // Import the ImageUpload component
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
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
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setPhone(response.data.phone);
                setStoreName(response.data.storeName);
                setGstNumber(response.data.gstNumber);
                if (response.data.address) {
                    setAddress(response.data.address);
                }
                if (response.data.profilePicture) {
                    setImagePreview(response.data.profilePicture);
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
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
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

    if (loading) return <p className="user-profile-loading">Loading...</p>;
    if (error) return <p className="user-profile-error">{error}</p>;

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                <div className="user-profile-upload-section">
                    <ImageUpload onImageChange={handleImageChange} />
                </div>

                <form onSubmit={handleSubmit} className="user-profile-form">
                    <h3>Personal Details</h3>
                    <div className="user-profile-personal-details">
                        <div className="user-profile-form-group">
                            <label>First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Please fill this"
                                    required
                                />
                            ) : (
                                <span className="user-profile-value-background">{firstName || "Please fill this"}</span>
                            )}
                        </div>
                        <div className="user-profile-form-group">
                            <label>Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Please fill this"
                                    required
                                />
                            ) : (
                                <span className="user-profile-value-background">{lastName || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    <div className="user-profile-personal-details">
                        <div className="user-profile-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={user?.email || "Please fill this"}
                                readOnly
                                className="user-profile-value-background"
                            />
                        </div>
                        <div className="user-profile-form-group">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Please fill this"
                                    required
                                />
                            ) : (
                                <span className="user-profile-value-background">{phone || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    <h3>Store Details</h3>
                    <div className="user-profile-store-details">
                        <div className="user-profile-form-group">
                            <label>Store Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="Please fill this"
                                    required
                                />
                            ) : (
                                <span className="user-profile-value-background">{storeName || "Please fill this"}</span>
                            )}
                        </div>
                        <div className="user-profile-form-group">
                            <label>GST Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={gstNumber}
                                    onChange={(e) => setGstNumber(e.target.value)}
                                    placeholder="Please fill this"
                                    required
                                />
                            ) : (
                                <span className="user-profile-value-background">{gstNumber || "Please fill this"}</span>
                            )}
                        </div>
                    </div>

                    <h3>Address</h3>
                    <div className="user-profile-address-details">
                        {Object.entries(address).map(([key, value]) => (
                            <div className="user-profile-form-group" key={key}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                                        placeholder="Please fill this"
                                        required={key !== "landmark"} // landmark is optional
                                    />
                                ) : (
                                    <span className="user-profile-value-background">{value || "Please fill this"}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="user-profile-form-actions">
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
