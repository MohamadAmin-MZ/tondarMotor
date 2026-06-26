const { json } = require("express")
const productModel = require("../../model/v1/Product")
const path = require("path")
const manufacturerModel = require("../../model/v1/manufacturer")
const motorcycleTypeModel = require("../../model/v1/motorcycleType")
const mongoose = require("mongoose")

const create = async (req, res) => {
    try {
        const { name, href, description, price, brand, type, color, details, isSpecialOffer } = req.body

        if (!name || !href || !description || !price || !color || isSpecialOffer === undefined) {
            return res.status(400).json({ message: "All Fields Are Required." });
        }

        if (typeof name !== "string" || typeof description !== "string" || typeof href !== "string") {
            return res.status(400).json({ message: "Name, Description, And Href Must Be Strings." });
        }

        if (isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be a valid positive number." });
        }

        const SpecialOffer = parseInt(isSpecialOffer, 10)
        if (SpecialOffer !== 1 && SpecialOffer !== 0) {
            return res.status(400).json({ message: "isSpecialOffer must be 0 or 1" });
        }

        if (!req.files || !req.files.cover || req.files.cover.length === 0) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const coverFile = req.files.cover[0];
        const coverPath = `/public/manufacturer/covers/${coverFile.filename}`;

        let galleryPaths = [];
        if (req.files.gallery && req.files.gallery.length > 0) {
            galleryPaths = req.files.gallery.map(file => `/public/manufacturer/covers/${file.filename}`);
        }

        if (!mongoose.Types.ObjectId.isValid(brand)) {
            return res.status(404).json({ message: "Brand ID is Not Valid." });
        }

        if (!mongoose.Types.ObjectId.isValid(type)) {
            return res.status(404).json({ message: "Type ID is Not Valid." });
        }

        let arrayDetails = []
        if (details) {
            try {
                arrayDetails = JSON.parse(details)
            } catch (error) {
                console.error("JSON Parse Error For Details:", error);
                return res.status(400).json({ message: "Invalid JSON Format For Details." });
            }
        }

        if (arrayDetails && !Array.isArray(arrayDetails)) {
            return res.status(400).json({ message: "Details Must Be An Array Of Objects." });
        }

        if (arrayDetails) {
            for (const spec of arrayDetails) {
                if (!spec.name || !spec.value) {
                    return res.status(400).json({ message: "Name Or Value In Details Is Required." });
                }
            }
        }

        const product = await productModel.create({
            name,
            href,
            description,
            price,
            brand,
            type,
            color,
            isSpecialOffer: SpecialOffer,
            details: arrayDetails,
            cover: coverPath,
            gallery: galleryPaths
        })

        return res.status(201).json({ product, message: "Create Product Successfully." })


    } catch (error) {
        console.error("Error Creating Product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOnePage = async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'view', 'v1', 'product', 'product.html'));
}

const getOne = async (req, res) => {
    try {
        const productId = req.params.id

        if (productId === "" || productId.trim() === "") {
            return res.status(400).json({ message: "Product Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {

            return res.status(404).json({ message: "Product ID is Not Valid." });
        }

        const products = await productModel.findOne({ _id: productId }).populate({ path: "brand", select: "name" }).populate({ path: "type", select: "name" }).lean()

        if (!products) {
            return res.status(400).json({ message: "Product Not Found." });
        }

        return res.status(200).json({ products: products })

    } catch (error) {
        console.error("Error Get One Products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const remove = async (req, res) => {
    try {
        const productId = req.params.id

        if (productId === "" || productId.trim() === "") {
            return res.status(400).json({ message: "Product Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({ message: "Product ID is Not Valid." });
        }

        const deletedProduct = await productModel.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product Not Found." });
        }

        return res.status(200).json({ message: "Delete Product Successfully." })

    } catch (error) {
        console.error("Error Remove Product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const update = async (req, res) => {
    try {
        const productId = req.params.id

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No Update Data Provided In The Request Body." });
        }

        const { name, href, description, price, brand, type, color, details, isSpecialOffer } = req.body

        if (productId === "" || productId.trim() === "") {
            return res.status(400).json({ message: "Product Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Product ID is Not Valid." });
        }

        const updateFields = {}

        if (name !== undefined && name.trim() !== "") {
            updateFields.name = name
        }

        if (href !== undefined && href.trim() !== "") {
            updateFields.href = href
        }

        if (description !== undefined && description.trim() !== "") {
            updateFields.description = description
        }

        if (price !== undefined && price.trim() !== "") {
            const numericPrice = parseFloat(price);
            if (!isNaN(numericPrice)) {
                updateFields.price = numericPrice;
            } else {
                return res.status(400).json({ message: "Invalid Price Format. Price Must Be a Number." });
            }
        }

        if (isSpecialOffer !== undefined && isSpecialOffer.trim() !== "") {
            const numericIsSpecialOffer = parseFloat(isSpecialOffer);
            if (numericIsSpecialOffer !== 1 && numericIsSpecialOffer !== 0) {
                updateFields.isSpecialOffer = numericIsSpecialOffer;
            } else {
                return res.status(400).json({ message: "Invalid Price Format. Price Must Be a Number." });
            }
        }

        if (brand !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(brand)) {
                return res.status(400).json({ message: "Invalid Brand ID." });
            }

            const isValidBrand = await manufacturerModel.findOne({ _id: brand })
            if (!isValidBrand) {
                return res.status(400).json({ message: "Brand Not Found." });
            }

            updateFields.brand = brand;
        }

        if (type !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(type)) {
                return res.status(400).json({ message: "Invalid Type ID." });
            }

            const isValidType = await motorcycleTypeModel.findOne({ _id: type })

            if (!isValidType) {
                return res.status(400).json({ message: "type Not Found." });
            }

            updateFields.type = type;
        }

        if (color !== undefined && color.trim() !== "") {
            updateFields.color = color
        }

        let arrayDetails = []
        if (details) {
            try {
                arrayDetails = JSON.parse(details)
            } catch (error) {
                console.error("JSON Parse Error For Details:", error);
                return res.status(400).json({ message: "Invalid JSON Format For Details." });
            }

            if (arrayDetails.length === 0) {
                return res.status(400).json({ message: "Details Array Is Empty." })
            }

            if (arrayDetails && !Array.isArray(arrayDetails)) {
                return res.status(400).json({ message: "Details Must Be An Array Of Objects." });
            }

            if (arrayDetails) {
                for (const spec of arrayDetails) {
                    if (!spec.name || !spec.value) {
                        return res.status(400).json({ message: "Name Or Value In Details Is Required." });
                    }
                }

                updateFields.details = arrayDetails
            }
        }

        if (req.file) {
            updateFields.cover = `/public/manufacturer/covers/${req.file.filename}`
        }

        const productUpdated = await productModel.findOneAndUpdate({ _id: productId }, { $set: updateFields }, { returnDocument: "after" })

        if (!productUpdated) {
            return res.status(404).json({ message: "Product Not Found." });
        }

        return res.status(200).json({ message: "Product Updated Successfully.", productUpdated: productUpdated })

    } catch (error) {
        console.error("Error Update Product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAll = async (req, res) => {
    try {
        const { brand, engine, maxPrice } = req.query;

        let filter = {};

        if (brand) {
            const brandsArray = [].concat(brand);
            const manufacturers = await manufacturerModel.find({ name: { $in: brandsArray } });
            const brandIds = manufacturers.map(m => m._id);
            filter.brand = { $in: brandIds };
        }

        if (engine) {
            const enginesArray = [].concat(engine);
            const types = await motorcycleTypeModel.find({ name: { $in: enginesArray } });
            const typeIds = types.map(t => t._id);
            filter.type = { $in: typeIds };
        }

        if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }

        const products = await productModel.find(filter).populate({ path: "brand", select: "name" }).populate({ path: "type", select: "name" }).sort({ createdAt: -1 })

        if (products.length === 0) {
            return res.status(200).json({ ok: true, products: [] });
        }

        return res.status(200).json({ ok: true, products: products })

    } catch (error) {
        console.error("Error Get All Product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const specialOffers = async (req, res) => {
    try {
        const productSpecialOffers = await productModel.find({ isSpecialOffer: 1 })

        return res.status(200).json(productSpecialOffers)
    } catch (error) {
        console.error("Error Get specialOffers Product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    create,
    getOne,
    remove,
    update,
    getAll,
    specialOffers,
    getOnePage,
}