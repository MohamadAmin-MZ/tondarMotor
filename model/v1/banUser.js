const mongoose = require("mongoose")

const bamUserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true })


const banUserModel = mongoose.model("Ban-User", bamUserSchema)

module.exports = banUserModel