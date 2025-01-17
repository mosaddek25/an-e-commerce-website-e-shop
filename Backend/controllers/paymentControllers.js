// const { CartItem } = require('../models/cartItem');
// const { Profile } = require('../models/profile');
// const PaymentSession = require('ssl-commerz-node').PaymentSession;
// const { Order } = require('../models/order');
// const { Payment } = require('../models/payment');
// const path = require('path');

// // Request a Session
// // Payment Process
// // Receive IPN
// // Create an Order 

// module.exports.ipn = async (req, res) => {
//     const payment = new Payment(req.body);
//     const tran_id = payment['tran_id'];
//     if (payment['status'] === 'VALID') {
//         const order = await Order.updateOne({ transaction_id: tran_id }, { status: 'Complete' });
//         await CartItem.deleteMany(order.cartItems);
//     } else {
//         await Order.deleteOne({ transaction_id: tran_id });
//     }
//     await payment.save();
//     return res.status(200).send("IPN");

// }

// module.exports.initPayment = async (req, res) => {
//     const userId = req.user._id;
//     const cartItems = await CartItem.find({ user: userId });
//     const profile = await Profile.findOne({ user: userId });

//     const { address1, address2, city, state, postcode, country, phone } = profile;

//     const total_amount = cartItems.map(item => item.count * item.price)
//         .reduce((a, b) => a + b, 0);

//     const total_item = cartItems.map(item => item.count)
//         .reduce((a, b) => a + b, 0);

//     const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();

//     const payment = new PaymentSession(true, process.env.STORE_ID, process.env.STORE_PASSWORD);

//     // Set the urls
//     payment.setUrls({
//         success: 'https://secret-stream-23319.herokuapp.com/api/payment/success', // If payment Succeed
//         fail: 'yoursite.com/fail', // If payment failed
//         cancel: 'yoursite.com/cancel', // If user cancel payment
//         ipn: 'https://secret-stream-23319.herokuapp.com/api/payment/ipn' // SSLCommerz will send http post request in this link
//     });

//     // Set order details
//     payment.setOrderInfo({
//         total_amount: total_amount, // Number field
//         currency: 'BDT', // Must be three character string
//         tran_id: tran_id, // Unique Transaction id 
//         emi_option: 0, // 1 or 0
//     });

//     // Set customer info
//     payment.setCusInfo({
//         name: req.user.name,
//         email: req.user.email,
//         add1: address1,
//         add2: address2,
//         city: city,
//         state: state,
//         postcode: postcode,
//         country: country,
//         phone: phone,
//         fax: phone
//     });

//     // Set shipping info
//     payment.setShippingInfo({
//         method: 'Courier', //Shipping method of the order. Example: YES or NO or Courier
//         num_item: total_item,
//         name: req.user.name,
//         add1: address1,
//         add2: address2,
//         city: city,
//         state: state,
//         postcode: postcode,
//         country: country,
//     });

//     // Set Product Profile
//     payment.setProductInfo({
//         product_name: 'Bohubrihi E-com Products',
//         product_category: 'General',
//         product_profile: 'general'
//     });

//     response = await payment.paymentInit();
//     const order = new Order({ cartItems: cartItems, user: userId, transaction_id: tran_id, address: profile });
//     if (response.status === 'SUCCESS') {
//         order.sessionKey = response['sessionkey'];
//         await order.save();
//     }
//     return res.status(200).send(response);
// }

// module.exports.paymentSuccess = async (req, res) => {
//     res.sendFile(path.join(__basedir + "/public/success.html"))
// }




const { CartItem } = require('../models/cartItem');
const { Profile } = require('../models/profile');
const PaymentSession = require('ssl-commerz-node').PaymentSession;
const { Order } = require('../models/order');
const { Payment } = require('../models/payment');
const path = require('path');

// IPN - Instant Payment Notification
module.exports.ipn = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        const tran_id = payment['tran_id'];

        if (payment['status'] === 'VALID') {
            const order = await Order.findOne({ transaction_id: tran_id });
            if (!order) return res.status(404).send("Order not found");

            order.status = 'Complete';
            await order.save();
            await CartItem.deleteMany({ _id: { $in: order.cartItems } });
        } else {
            await Order.deleteOne({ transaction_id: tran_id });
        }

        await payment.save();
        return res.status(200).send("IPN received and processed");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Initialize Payment Session
module.exports.initPayment = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItems = await CartItem.find({ user: userId });
        const profile = await Profile.findOne({ user: userId });

        if (!profile || cartItems.length === 0) {
            return res.status(400).send("Profile or cart items not found");
        }

        const { address1, address2, city, state, postcode, country, phone } = profile;
        const total_amount = cartItems.map(item => item.count * item.price).reduce((a, b) => a + b, 0);
        const total_item = cartItems.map(item => item.count).reduce((a, b) => a + b, 0);
        const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();

        const payment = new PaymentSession(true, process.env.STORE_ID, process.env.STORE_PASSWORD);

        // Set the URLs for the payment process
        payment.setUrls({
            success: 'http://localhost:3002/api/payment/success',
            fail: 'http://localhost:3002/payment/fail',
            cancel: 'http://localhost:3002/payment/cancel',
            ipn: 'http://localhost:3002/api/payment/ipn'
        });

        // Set order details
        payment.setOrderInfo({
            total_amount: total_amount,
            currency: 'BDT',
            tran_id: tran_id,
            emi_option: 0
        });

        // Set customer info
        payment.setCusInfo({
            name: req.user.name,
            email: req.user.email,
            add1: address1,
            add2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
            phone: phone,
            fax: phone
        });

        // Set shipping info
        payment.setShippingInfo({
            method: 'Courier',
            num_item: total_item,
            name: req.user.name,
            add1: address1,
            add2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country
        });

        // Set product info
        payment.setProductInfo({
            product_name: 'E-com Products',
            product_category: 'General',
            product_profile: 'general'
        });

        // Initiate payment
        const response = await payment.paymentInit();
        const order = new Order({ cartItems: cartItems, user: userId, transaction_id: tran_id, address: profile });

        if (response.status === 'SUCCESS') {
            order.sessionKey = response.sessionkey;
            await order.save();
            return res.redirect(response.GatewayPageURL); // Redirect user to the payment gateway page
        } else {
            return res.status(400).send("Payment initiation failed");
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Payment success endpoint
module.exports.paymentSuccess = async (req, res) => {
    try {
        const tran_id = req.query.tran_id; // Assuming tran_id is sent back after successful payment
        const order = await Order.findOne({ transaction_id: tran_id });

        if (!order) return res.status(404).send("Order not found");

        res.sendFile(path.join(__dirname, '../public/success.html')); // Serve static success page
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
