const motorcycleTypeModel = require("../../model/v1/motorcycleType")
const mongoose = require("mongoose")



const getAllForMain = async (req, res) => {
    try {
        const types = await motorcycleTypeModel.find().lean();

        const HTML = types.map(type => `
      <a class= "category" href="${type.href}">
        <img src="${type.cover}" alt="${type.name}">
        <p>${type.name}</p>
        </a>
      
        `).join('');

        return res.status(200).json({ ok: true, motorcycleType: HTML })
    } catch (error) {
        console.error("Error Geting Motorcycle Type for main:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllForFilterProduct = async (req, res) => {
    try {
        const engins = await motorcycleTypeModel.find().lean();

        return res.status(200).json({ ok: true, engins })
    } catch (error) {
        console.error("Error Geting Motorcycle Type for filter product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOne = async (req, res) => {
    try {
        const typeId = req.params.id

        if (typeId === "" || typeId.trim() === "") {
            return res.status(400).json({ message: "Type Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(typeId)) {
            return res.status(400).json({ message: "Type ID is Not Valid." });
        }

        const type = await motorcycleTypeModel.findOne({ _id: typeId })

        if (!type) {
            return res.status(404).json({ message: "Motorcycle Type Not Found." });
        }

        return res.status(200).json({ motorcycleType: type })

    } catch (error) {
        console.error("Error Get One Motorcycle Type:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const create = async (req, res) => {
    try {
        const { name, href } = req.body

        if (name === "" || name.trim() === "") {
            return res.status(400).json({ message: "Name Is Required." })
        }

        if (href === "" || href.trim() === "") {
            return res.status(400).json({ message: "Href Is Required." })
        }

        if (!req.file) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const coverPath = `/public/manufacturer/covers/${req.file.filename}`;

        const existingTypes = await motorcycleTypeModel.findOne({ name }).lean()

        if (existingTypes) {
            return res.status(409).json({ message: "Motorcycle Type Already Exists." })
        }

        const newType = await motorcycleTypeModel.create({ name: name.trim(), href: href.trim(), cover: coverPath })
        return res.status(201).json({ message: "Create Motorcycle Type Successfully.", MotorType: newType })

    } catch (error) {
        console.error("Error Create Motorcycle Type:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const remove = async (req, res) => {
    try {
        const typeId = req.params.id

        if (typeId === "" || typeId.trim() === "") {
            return res.status(400).json({ message: "Type Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(typeId)) {
            return res.status(400).json({ message: "Type ID is Not Valid." });
        }

        const deletedType = await motorcycleTypeModel.findByIdAndDelete({ _id: typeId })

        if (!deletedType) {
            return res.status(404).json({ message: "Motorcycle Type Not Found." })
        }

        return res.status(200).json({ message: "Motorcycle Type Remove Successfully." })
    } catch (error) {
        console.error("Error Remove Motorcycle Type:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }


}

const update = async (req, res) => {
    try {
        const typeId = req.params.id
        const { name, href } = req.body

        if (typeId === "" || typeId.trim() === "") {
            return res.status(400).json({ message: "Type Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(typeId)) {
            return res.status(400).json({ message: "Type ID is Not Valid." });
        }

        const updateFields = {}

        if (name !== undefined && name.trim() !== "") {
            updateFields.name = name
        }

        if (href !== undefined && href.trim() !== "") {
            updateFields.href = href
        }

        if (req.file) {
            const coverPath = `/public/manufacturer/covers/${req.file.filename}`
            updateFields.cover = coverPath
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field (name or href) is required for update." });
        }

        const updateType = await motorcycleTypeModel.findByIdAndUpdate({ _id: typeId }, { $set: updateFields })

        if (!updateType) {
            return res.status(404).json({ message: "Motorcycle Type Not Found." })
        }

        return res.status(200).json({ message: "Motorcycle Type Update Is Successfully." })

    } catch (error) {
        console.error("Error Update Motorcycle Type:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    getAllForMain,
    getOne,
    create,
    remove,
    update,
    getAllForFilterProduct
}