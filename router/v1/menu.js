const express = require("express")
const menuController = require("../../controller/v1/menu")
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router()

router.post("/", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, menuController.create)
router.delete("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, menuController.remove)
router.patch("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, menuController.update)
router.get("/", menuController.getAll)

module.exports = router