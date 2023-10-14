const express = require('express');
const router = express.Router();
const Vendor = require('./models/vendors');
const Product = require('./models/products');
const Order = require('./models/orders');


router.get('/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/vendor/:id/getOrders', async (req, res) => {
    try {
        const vendorId = req.params.id;

        const orders = await Order.find({
            cart_item: {
                $elemMatch: {
                    vendorId: vendorId
                }
            }
        }).exec();

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;