const express = require("express")
const userController = require("../../controller/v1/user")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")


const router = express.Router()

router.use(authMiddleware.havingToken, isAdminMiddleware.adminAuthentication)

router.get("/", userController.getAll)
router.delete("/:id", userController.remove)
router.put("/:id/role", userController.changeRole)
router.post("/:id/banOrUnbanUser", userController.banOrUnbanUser)
router.put("/:id", userController.update)



module.exports = router