const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["created", "earned", "failed"], 
    default: "created",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Connects this payment to a User in your DB
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);