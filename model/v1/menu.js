const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Menu",
        required: false
    },
}, { timestamps: true })


const menuModel = mongoose.model("Menu", menuSchema)

module.exports = menuModel