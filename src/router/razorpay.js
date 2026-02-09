const express = require("express");
const Razorpay = require("razorpay");
const razorpayRouter = express.Router();
const crypto = require("crypto");
const Payment  = require("../models/payment.js");
const userModel = require("../models/user");
const { authuser } = require("../middlewares/auth.js");
require("dotenv").config(); 



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});



razorpayRouter.post("/create", authuser, async (req, res) => {
    try {
        
        const userId = req.user._id; 

        const options = {
            amount: 500 * 100, 
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);


        const newPayment = new Payment({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            status: "created",
            userId: userId 
        });

        await newPayment.save();

        res.json({
            success: true,
            order: order,
        });

    } catch (error) {
        console.error("Payment Error:", error); 
        

        res.status(500).json({ 
            success: false, 
            message: "Order creation failed", 
            error: error.message 
        });
    }
});

razorpayRouter.post("/verify",authuser, async(req,res)=>{
    
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if(isAuthentic){
            try {
                const payment = await Payment.findOne({
                    orderId: razorpay_order_id
                });
                payment.paymentId = razorpay_payment_id;
                payment.signature = razorpay_signature;
                payment.status = "earned";
                await payment.save();

                const user = await userModel.findById(payment.userid);
                user.isPremium = true;
                user.membershipType ="premium";
                user.membershipStartDate = new Date();
                user.memshipExpiry = new Date(Date.now() + 30*24*60*60*1000);

                await user.save();
                res.json({
                    success: true,
                    message: "Payment verified & User Upgraded!"
                });
                
            } catch (error) {
                console.log("🛑 DETAILED ERROR:", error); 
    
    res.status(500).json({ 
        success: false, 
        message: "Order creation failed",
        error: error.message,       
        stack: error.stack})

                
            }



        }

        
    
        
    
});
module.exports={
    razorpayRouter
}