const mongoose = require("mongoose")

const textTitleArticlesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
},
    { timestamps: true }
)

const textTitleArticlesModel = mongoose.model("TextTitleArticles", textTitleArticlesSchema)

module.exports = textTitleArticlesModel