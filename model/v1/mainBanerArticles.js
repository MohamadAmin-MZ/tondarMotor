const mongoose = require("mongoose")

const mainBanerArticlesSchema = mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    isActive : {
        type: Boolean,
        required: true,
    }

},
    { timestamps: true }
)

const mainBanerArticlesModel = mongoose.model("MainBanerArticles", mainBanerArticlesSchema)

module.exports = mainBanerArticlesModel