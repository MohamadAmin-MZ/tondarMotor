const adminAuthentication = async (req, res, next) => {
    
    const isAmin = req.user.role === "ADMIN"

    if (isAmin) {
        return next()
    }

    return res.status(403).json({message: "This Route Is Accessible Only For Admins !!"})
}

module.exports = { adminAuthentication }