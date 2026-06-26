const express = require("express")
const authMiddleware = require("../../middlewares/auth")
const isAdminMiddleware = require("../../middlewares/isAdmin")
const articleController = require("../../controller/v1/article")
const multerStorage = require("../../utils/uploader")
const multer = require("multer")

const router = express.Router()


router.get("/articleBar", articleController.articleBar);
router.get("/mineBaner", articleController.mineBaner);
router.get("/getTextTitleArticles", articleController.getTextTitleArticles);
router.post("/createMainBaner", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), articleController.createMainBaner);
router.post("/createTextTitleArticles", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, articleController.createTextTitleArticles);
router.post("/", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), articleController.create);
router.get("/", articleController.getAll);
router.get("/:id/page", articleController.getPageArticle);
router.get("/:id", articleController.getOne);
router.patch("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover"), articleController.update);
router.delete("/:id", authMiddleware.havingToken, isAdminMiddleware.adminAuthentication, articleController.remove);





module.exports = router