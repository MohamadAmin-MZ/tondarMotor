const productModel = require("../../model/v1/Product")
const articletModel = require("../../model/v1/article")

const get = async (req, res) => {
    try {
        const key = req.params.key
        const regex = new RegExp(key, 'i');

        const products = await productModel.find({
            $or: [
                { name: regex },
                { description: regex }
            ]
        });

        const articles = await articletModel.find({
            $or: [
                { title: regex },
                { description: regex },
                { body: regex }
            ]
        });

        return res.status(200).json({ products: products, articles: articles })

    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = get