const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    salt: {
        type: String
    },
    hash: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    termsAndCondition: {
        type: String,
    },
    paymentInfo: { type: mongoose.Schema.Types.Array, ref: "PaymentInfo" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;