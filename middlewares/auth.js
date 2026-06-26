const jwt = require("jsonwebtoken")
const userModel = require("../model/v1/user")

const havingToken = async (req, res, next) => {
    const authHader = req.header("Authorization")?.split(" ")

    if (authHader?.length !== 2) {
        return res.status(403).json({ message: "This route is protected and you can't have access to it !!" })
    }
    
    const token = authHader[1]

    try {

        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ _id: jwtPayload.id })
        
        Reflect.deleteProperty(user, "password")

        req.user = user

        next()
    } catch (error) {
        return res.json(error)
    }

}

module.exports = { havingToken }