const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    productId: String,
    productName: String,
    vendorId: String,
    item_count: Number,
    quantity: Number,
    cogs: Number,
    price: Number
});

const orderSchema = new Schema({
    id: String,
    cart_item: [cartItemSchema],
    payment_at: Date
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;