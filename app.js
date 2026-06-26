const express = require("express")
const cors = require("cors")
const path = require("path")
const bodyParser = require("body-parser")
const authRouter = require("./router/v1/auth")
const userRouter = require("./router/v1/user")
const motorcycleTypeRouter = require("./router/v1/motorcycleType")
const berandRouter = require("./router/v1/manufacturer")
const productRouter = require("./router/v1/product")
const articleRouter = require("./router/v1/article")
const menuRouter = require("./router/v1/menu")
const searchRouter = require("./router/v1/search")
const mainRouter = require("./router/v1/main")


const app = express()
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/view', express.static(path.join(__dirname, 'view')));


app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/v1/auth", authRouter)
app.use("/v1/user", userRouter)
app.use("/v1/motorcycleType", motorcycleTypeRouter)
app.use("/v1/berand", berandRouter)
app.use("/v1/product", productRouter)
app.use("/v1/article", articleRouter)
app.use("/v1/menu", menuRouter)
app.use("/v1/search", searchRouter)
app.use("/v1/main", mainRouter)

module.exports = app;