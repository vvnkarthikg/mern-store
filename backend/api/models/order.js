//we install mongoose-sequence to auto-increment order id

// models/order.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the order schema
const orderSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    }, //to get product details populate into here
    quantity: {
        type: Number,
        default: 1
    },
    orderNumber: { 
        type: Number, 
        unique: true 
    },
    user: { // Add user reference to associate orders with users
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    }
});

// Apply the auto-increment plugin to orderSchema
orderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber' });

module.exports = mongoose.model('Order', orderSchema);