const menuModel = require("../../model/v1/menu")
const mongoose = require("mongoose")


const create = async (req, res) => {
    try {
        const { title, href, parent } = req.body

        if (!title || !href) {
            return res.status(400).json({ message: "Title, Href Is Required." })
        }

        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Title Type Is String ant Not Empty." })
        }

        if (typeof href !== "string" || href.trim() === "") {
            return res.status(400).json({ message: "Href Type Is String ant Not Empty." })
        }

        if (parent) {
            if (!mongoose.Types.ObjectId.isValid(parent)) {
                return res.status(400).json({ message: "Parent Id Is Not Valid." })
            }
        }

        const menu = await menuModel.create({
            title: title.trim(),
            href: href.trim(),
            parent
        })

        return res.status(201).json(menu)
    } catch (error) {
        console.error("Error Creating menu:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

const remove = async (req, res) => {
    try {
        const menuId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: "Menu Id  Is Not Valid." })
        }

        const menuRemoved = await menuModel.findByIdAndDelete(menuId)

        if (!menuRemoved) {
            return res.status(200).json({ message: "Menu Not Found." })
        }

        return res.json(menuRemoved)
    } catch (error) {
        console.error("Error Removed menu:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

const update = async (req, res) => {
    try {
        const menuId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: "Menu Id  Is Not Valid." })
        }

        const { title, href, parent } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (href) updateData.href = href;
        if (parent) updateData.parent = parent;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "At least one field is required for update (title, href, or parent)" });
        }

        const updatedMenu = await menuModel.findByIdAndUpdate(
            menuId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedMenu) {
            return res.status(404).json({ message: "Menu Not Found." });
        }

        res.json({ message: "Menu updated successfully.", menu: updatedMenu });

    } catch (error) {
        console.error("Error Update menu:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAll = async (req, res) => {
    const menus = await menuModel.find({}).lean()

    menus.forEach((menu) => {
        const subMenu = []
        for (let i = 0; i < menus.length; i++) {
            const mainMenu = menus[i]
            if (String(mainMenu.parent) === String(menu._id)) {
                subMenu.push(menus.splice(i, 1)[0])
                i = i - 1
            }
        }
        menu.subMenu = subMenu
    })

    let linksHtml = ""

    menus.forEach((menu, index) => {
        const title = menu.title
        const href = menu.href
        linksHtml += `<a href="${href}">${title}</a>`;

        if (index < menus.length - 1) {
            linksHtml += `<span>|</span>`;
        }
    })

    return res.status(200).json({ ok: true, linksHtml })
}

module.exports = {
    getAll,
    create,
    remove,
    update,
}