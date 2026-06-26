const mainBanerModel = require("../../model/v1/mainBaner")
const berandModel = require("../../model/v1/manufacturer")
const productModel = require("../../model/v1/Product")
const path = require("path")


const createMainBaner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const updata = await mainBanerModel.updateMany({ isActive: true }, { $set: { isActive: false } })

        const banerPath = `/public/manufacturer/covers/${req.file.filename}`;


        const createMainBaner = await mainBanerModel.create({
            imageUrl: banerPath,
            isActive: true
        })

        return res.status(201).json(createMainBaner)

    } catch (error) {
        console.error("Error Creating MainBaner:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

const getMainBaner = async (req, res) => {
    try {
        const baner = await mainBanerModel.findOne({ isActive: true })

        return res.status(200).json({ ok: true, imageUrl: baner.imageUrl })
    } catch (error) {
        console.error("Error Geting MainBaner:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const berandBar = async (req, res) => {
    try {
        const brands = await berandModel.find({})


        let listItemsHtml = "";

        brands.forEach((link, index) => {
            listItemsHtml += `<li>`;
            listItemsHtml += `<a href="${link.href}">${link.name}</a>`;
            listItemsHtml += `</li>`;
        })
        return res.status(200).json({ ok: true, listItemsHtml: listItemsHtml })
    } catch (error) {
        console.error("Error Geting BerandBar:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const specialOffersBar = async (req, res) => {
    try {
        const products = await productModel.find({ isSpecialOffer: 1 })



        function createProductElement(product) {
            const price = Intl.NumberFormat('fa-IR').format(product.price) + ' تومان';

            return `<div class="product-item">
            <a href="${`http://localhost:4000/v1/product/${product._id}/page`}">
                <img src="${product.cover}" alt="${product.name}">
                <h3>${product.name}</h3>
            </a>
            <div class="price">${price}</div>
            <button class="add-to-cart">افزودن به سبد خرید</button></div>
            `;
        }

        const linksHtml = products.map(product => createProductElement(product));

        const allProductsHtml = linksHtml.join('');

        return res.status(200).json({ ok: true, linksHtml: allProductsHtml })
    } catch (error) {
        console.error("creating specialOffersBar:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getPageProductByBrand = async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'view', 'v1', 'list-of-product2', 'list_of_procuct.html'));
}

module.exports = {
    createMainBaner,
    getMainBaner,
    berandBar,
    specialOffersBar,
    getPageProductByBrand
}