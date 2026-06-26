const express = require("express")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")
const mainController = require("../../controller/v1/main")
const multerStorage = require("../../utils/uploader")
const multer = require("multer")

const router = express.Router()

router.post("/mainBaner", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), mainController.createMainBaner)
router.get("/getMainBaner", mainController.getMainBaner)
router.get("/berandBar", mainController.berandBar)
router.get("/specialOffersBar", mainController.specialOffersBar)
router.get("/brand/", mainController.getPageProductByBrand);


module.exports = router