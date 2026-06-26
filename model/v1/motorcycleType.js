const mongoose = require("mongoose")

const motorcycleTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
}, { timestamps: true })


const motorcycleTypeModel = mongoose.model("MotorcycleType", motorcycleTypeSchema)

module.exports = motorcycleTypeModel