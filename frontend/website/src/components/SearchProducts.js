// src/SearchProducts.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchProducts = () => {
    const [productName, setProductName] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/name/${productName}`);
            setResults(response.data.products);
            setError('');
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('No products found.');
            setResults([]);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search for a product..." 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    required 
                />
                <button type="submit">Search</button>
            </form>

            {error && <p>{error}</p>}
            
            <ul>
                {results.map(product => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                        {/* Optionally add an image */}
                        {product.productImage && <img src={product.productImage} alt={product.name} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchProducts;