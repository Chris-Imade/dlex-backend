const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    id: Number,
    clientName: String,
    status: String,
    priority: String,
    deadline: Date,
    email: {
        type: String
    },
    phone: String,
    phoneTwo: String,
    desc: String,
    uniqueIdentifier: String,
    products: { type: mongoose.Schema.Types.Array, ref: "Products" }
}, { timestamp: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;