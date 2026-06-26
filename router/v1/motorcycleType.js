const express = require("express")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")
const motorcycleTypeController = require("../../controller/v1/motorcycleType")
const multerStorage = require("../../utils/uploader")
const multer = require("multer")

const router = express.Router()

router.get("/", motorcycleTypeController.getAllForMain)
router.get("/getAllForFilterProduct", motorcycleTypeController.getAllForFilterProduct)
router.get("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, motorcycleTypeController.getOne)
router.post("/", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), motorcycleTypeController.create)
router.delete("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, motorcycleTypeController.remove)
router.patch("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), motorcycleTypeController.update)




module.exports = router