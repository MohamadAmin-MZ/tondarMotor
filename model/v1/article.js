const mongoose = require("mongoose")

const articlesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
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
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    href: {
        type: String,
        required: true
    },
    showBar: {
        type: Number,
        required: true,
        default: 0   // 0 >> not show , 1 >> show
    },
    status: {
        type: Number,   // 0 >> draft , 1 >> published
        required: true
    },
    publishedAt: {
        type: String,
        default: null,
        required: false
    },
    readTime: {
        type: Number,
        default: 0,
        required: false
    },
},
    { timestamps: true }
)

const articlesModel = mongoose.model("Articles", articlesSchema)

module.exports = articlesModel