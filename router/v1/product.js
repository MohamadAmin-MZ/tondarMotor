const express = require("express")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")
const productController = require("../../controller/v1/product")
const multerStorage = require("../../utils/uploader")
const multer = require("multer")

const router = express.Router()


router.get("/special-offers", productController.specialOffers);
router.get("/:id/page", productController.getOnePage);
router.get("/:id", productController.getOne);
router.patch("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), productController.update);
router.delete("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, productController.remove);
router.post("/", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).fields([{ name: "cover", maxCount: 1 }, { name: "gallery", maxCount: 20 }]), productController.create);
router.get("/", productController.getAll);



module.exports = router