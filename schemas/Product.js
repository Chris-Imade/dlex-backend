const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: {
        type: String,
    },
    imageFormat: {
        type: String,
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    desc: String,
    uniqueIdentifier: String,
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;