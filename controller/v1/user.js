const mongoose = require("mongoose");
const userModel = require("../../model/v1/user");
const banUserModel = require("../../model/v1/banUser");

const getAll = async (req, res) => {
    try {
        const getUsers = await userModel.find({}, "-password -__v -role")
        return res.status(200).json({ users: getUsers })
    } catch (error) {
        console.error("Error Geting Users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

const remove = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {
            return res.status(400).json({ message: "User ID Is Required." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "User ID is Not Valid." });
        }

        const userDeleted = await userModel.findOneAndDelete({ _id: userId })

        if (!userDeleted) {
            return res.status(404).json({ message: "User Not Found." })
        }

        return res.status(200).json({
            message: "User deleted successfully.", deletedUser: {
                username: userDeleted.username,
                name: userDeleted.name,
                email: userDeleted.email,
                phone: userDeleted.phone,
                role: userDeleted.role

            }
        })

    } catch (error) {
        console.error("Error Removing Users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const changeRole = async (req, res) => {
    try {
        const userId = req.params.id
        const { role } = req.body

        if (!userId) {
            return res.status(400).json({ message: "User ID Is Required." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "User ID is Not Valid." });
        }

        if (!role) {
            return res.status(400).json({ message: "New Role Is Required." });
        }

        const normalizedNewRole = role.toUpperCase()

        const allowRoles = ["ADMIN", "USER"]

        if (!allowRoles.includes(normalizedNewRole)) {
            return res.status(400).json({ message: "Invalid Role Provided. Allowed Roles Are: [ADMIN , USER]" });
        }

        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User Not Found." });
        }

        let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

        const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: { role: newRole } }, { returnDocument: 'after', runValidators: true }).select("username name email phone role")

        return res.status(200).json({ message: "Change Role User successfully.", newRoleUser: updatedUser })

    } catch (error) {
        console.error("Error New Role Users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const banOrUnbanUser = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {
            return res.status(400).json({ message: "User ID Is Required." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "User ID is Not Valid." });
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User Not Found." })
        }

        const userPhone = user.phone
        const isBanUser = await banUserModel.findOne({ phone: userPhone })

        if (isBanUser) {

            const removeUserInBanUser = await banUserModel.deleteOne({ phone: userPhone })

            if (removeUserInBanUser.deletedCount === 1) {
                return res.status(200).json({ message: "User Unbanned Successfully." })
            } else {
                console.error("Unban failed: User found in ban list but deleteCount was 0.");
                return res.status(500).json({ message: "Failed to unban user from database." });
            }

        } else {
            const addUserInBAnUser = await banUserModel.create({ phone: user.phone })

            if (addUserInBAnUser) {
                return res.status(201).json({ message: "User Banned Successfully.", user: addUserInBAnUser })
            } else {
                console.error("Ban failed.");
                return res.status(500).json({ message: "Failed to ban user from database." });
            }
        }
    } catch (error) {
        console.error("Error Ban Users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const update = async (req, res) => {

}

module.exports = {
    getAll,
    remove,
    changeRole,
    banOrUnbanUser,
    update
}