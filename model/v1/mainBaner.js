const mongoose = require("mongoose")

const mainBanerSchema = mongoose.Schema({
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

const mainBanerModel = mongoose.model("MainBaner", mainBanerSchema)

module.exports = mainBanerModel