const mongoose = require("mongoose")

const manufacturerSchema = new mongoose.Schema({
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
    cover: {
        type: String,
        required: true
    },
}, { timestamps: true })


const manufacturerModel = mongoose.model("Manufacturer", manufacturerSchema)

module.exports = manufacturerModel