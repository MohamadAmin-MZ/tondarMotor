const searchController = require("../../controller/v1/search")
const express = require("express")
const router = express.Router()


router.get("/:key", searchController)

module.exports = router
