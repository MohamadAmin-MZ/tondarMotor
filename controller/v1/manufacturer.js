const manufacturerModel = require("../../model/v1/manufacturer")
const mongoose = require("mongoose")

const create = async (req, res) => {
    try {
        const { name, href, description } = req.body

        if (!name || !href || !description) {
            return res.status(400).json({ message: "All Fields Are Required." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const coverPath = `/public/manufacturer/covers/${req.file.filename}`;

        const manufacturer = await manufacturerModel.create({
            name,
            href,
            description,
            cover: coverPath
        })

        return res.status(201).json({ message: "Manufacturer Created Successfully.", manufacturer: manufacturer });

    } catch (error) {
        console.error("Error Creating Manufacturer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOne = async (req, res) => {
    try {
        const berandId = req.params.id

        if (berandId === "" || berandId.trim() === "") {
            return res.status(400).json({ message: "Brand Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(berandId)) {
            return res.status(404).json({ message: "Brand ID is Not Valid." });
        }

        const berand = await manufacturerModel.findOne({ _id: berandId })

        if (!berand) {
            return res.status(400).json({ message: "Motorcycle Berand Not Found." });
        }

        return res.status(200).json({ berand: berand })
    } catch (error) {
        console.error("Error Get One Motorcycle Berand:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const remove = async (req, res) => {
    try {
        const berandId = req.params.id

        if (berandId === "" || berandId.trim() === "") {
            return res.status(400).json({ message: "Brand Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(berandId)) {
            return res.status(400).json({ message: "Brand ID is Not Valid." });
        }

        const berandDeleted = await manufacturerModel.findOneAndDelete({ _id: berandId })

        if (!berandDeleted) {
            return res.status(404).json({ message: "Berand Not Found." })
        }

        return res.status(200).json({ message: "Brand Deleted Is Successfully." })
    } catch (error) {
        console.error("Error Deleted Motorcycle Berand:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const update = async (req, res) => {
    try {
        const berandId = req.params.id
        const { name, href, description } = req.body

        if (berandId === "" || berandId.trim() === "") {
            return res.status(400).json({ message: "Brand Id Is Required." })
        }

        if (!mongoose.Types.ObjectId.isValid(berandId)) {
            return res.status(400).json({ message: "Brand ID is Not Valid." });
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

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field (name or href) is required for update." });
        }

        if (req.file) {
            updateFields.cover = `/public/manufacturer/covers/${req.file.filename}`
        }

        const brandUpdated = await manufacturerModel.findOneAndUpdate({ _id: berandId }, { $set: updateFields }, { returnDocument: "after" })

        if (!brandUpdated) {
            return res.status(404).json({ message: "Brand Not Found." });
        }

        return res.status(200).json({ message: "Brand Updated Successfully." })
    } catch (error) {
        console.error("Error Update Motorcycle Berand:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAll = async (req, res) => {
    try {
        const brands = await manufacturerModel.find({})

        return res.status(200).json({ok : true, brands})

    } catch (error) {
        console.error("Error get all Motorcycle Berand:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    create,
    getOne,
    remove,
    update,
    getAll
}