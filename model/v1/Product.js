const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    gallery: [
        {
            type: String
        }
    ],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MotorcycleType",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    isSpecialOffer: {
        type: Number,
        required: true,
        index: true
    },
    details: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
        }
    ],
}, { timestamps: true })


const productModel = mongoose.model("Product", productSchema)

module.exports = productModel