const mongoose = require('mongoose');
const Vendor = require('./models/vendors');
const Product = require('./models/products');
const Order = require('./models/orders');

const url = "mongodb+srv://user:12345@cluster0.z2q5bhi.mongodb.net/lonca-db?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true})
    .then((result) => console.log('connection OK'))
    .catch((err) => console.log(err));

const fs = require('fs');
const rawVendrosData = fs.readFileSync('vendors.json');
const vendorsData = JSON.parse(rawVendrosData);

const transformedVendorsData = vendorsData.map(vendor => ({
    id: vendor._id.$oid,
    name: vendor.name
}));

const rawProductsData = fs.readFileSync('parent_products.json');
const productsData = JSON.parse(rawProductsData);

const transformedProductsData = productsData.map(product => ({
    id: product._id.$oid,
    name: product.name,
    vendorId: product.vendor ? product.vendor.$oid : null
}));


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        for (const vendor of transformedVendorsData) {
            await Vendor.create(vendor);
        }
        for (const product of transformedProductsData) {
            await Product.create(product);
        }

        console.log('Data inserted successfully.');
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


const rawOrdersData = fs.readFileSync('orders.json');
const ordersData = JSON.parse(rawOrdersData);

async function processOrderData() {
    const transformedOrdersData = await Promise.all(
        ordersData.map(async (order) => {

            return {
                id: order._id.$oid,
                cart_item: await Promise.all(order.cart_item.map(async (cartItem) => {
                    const productId = cartItem.product ? cartItem.product.$oid : null;
                    const product = await Product.findOne({ id: productId });
                    const vendorId = product ? product.vendorId : null; // Replace with your actual logic
                    const productName = product ? product.name : null;

                    return {
                        productId: productId,
                        productName: productName,
                        vendorId: vendorId,
                        item_count: cartItem.item_count,
                        quantity: cartItem.quantity,
                        cogs: cartItem.cogs,
                        price: cartItem.price,
                    };
                })),
                payment_at: new Date(parseInt(order.payment_at.$date.$numberLong)),
            };
        })
    );

    return transformedOrdersData;
}

async function insertOrderData() {
    try {
        const transformedOrdersData = await processOrderData();

        console.log(transformedOrdersData)
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        for (const order of transformedOrdersData) {
            await Order.create(order);
        }

        console.log('Order data inserted successfully.');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

insertOrderData();


// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         console.log('Connected to MongoDB');
//
//         const deleteResult = await Order.deleteMany({});
//
//         console.log(`Deleted ${deleteResult.deletedCount} items.`);
//     })
//     .catch((err) => console.error('Error connecting to MongoDB:', err));




