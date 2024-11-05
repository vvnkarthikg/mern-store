const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const isAdmin = req.userData.isAdmin; // Check if user is admin

        let orders; // Declare orders variable

        if (isAdmin) {
            // Fetch all orders if the user is an admin
            orders = await order.find().populate('product');
        } else {
            // Fetch only the user's orders
            orders = await order.find({ user: userId }).populate('product');
        }

        // Transforming orders to include necessary fields
        const transformedOrders = orders.map(order => {
            return {
                id: order._id,
                product: {
                    id: order.product._id,
                    name: order.product.name,
                    price: order.product.price,
                    productImage: order.product.productImage,
                    quantity: order.product.quantity,
                    category: order.product.category,
                    description: order.product.description,
                },
                quantity: order.quantity,
                orderNumber: order.orderNumber // Include orderNumber if needed
            };
        });

        res.status(200).json({
            count: orders.length,
            orders: transformedOrders
        });
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: err.message });
    }
});


router.post('/', checkAuth, async (req, res) => {
    try {
        const pId = req.body.id;
        const product = await Product.findById(pId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the requested quantity is available
        if (req.body.quantity > product.quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity' });
        }

        // Update the product's quantity
        product.quantity -= req.body.quantity;
        await product.save();


        // Create the order and associate it with the logged-in user
        const newOrder = new order({
            quantity: req.body.quantity,
            product: pId,
            user: req.userData.userId // Associate with logged-in user
        });

        // Save the order and populate the product details
        let result = await newOrder.save();
        result = await result.populate('product'); // Populate after saving

        return res.status(201).json({ message: 'Order created', result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


router.get('/:orderId',checkAuth,(req,res)=>{

    try{
        const id = req.params.orderId;
        order.findById(id).populate('product')
        .then(order=>{
            res.status(200).json({
                order : order
            });
        });
        
    }
    catch(error){
        res.status(500).json(error);
    }
    
});

router.delete('/:orderId', checkAuth, async (req, res) => {
    try {
        const id = req.params.orderId;

        // Find the order by ID
        const del_Order = await order.findById(id); // Corrected method to find by ID
        if (!del_Order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the associated product
        const product = await Product.findById(del_Order.product); // Corrected method to find by ID
        if (product) {
            product.quantity += del_Order.quantity; // Increment product quantity by the order's quantity
            await product.save(); // Save the updated product
        }

        // Delete the order
        await order.findByIdAndDelete(id); 

        res.status(200).json({
            message: 'Order deleted and product quantity updated',
            order: del_Order
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



module.exports = router;