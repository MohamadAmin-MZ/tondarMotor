const express = require("express")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")
const manufacturerController = require("../../controller/v1/manufacturer")
const multerStorage = require("../../utils/uploader")
const multer = require("multer")

const router = express.Router()

router.post("/", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), manufacturerController.create)
router.delete("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, manufacturerController.remove)
router.patch("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), manufacturerController.update)
router.get("/",manufacturerController.getAll )
router.get("/:id", manufacturerController.getOne)





module.exports = router