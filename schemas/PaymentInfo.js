const mongoose = require("mongoose");

const paymentInfoSchema = new mongoose.Schema({
    bankName: {
        type: String,
        unique: true,
        required: true
    },
    accountName: {
        type: String,
        unique: true,
        required: true
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
})

const PaymentInfo = mongoose.model("PaymentInfo", paymentInfoSchema);

module.exports = PaymentInfo;