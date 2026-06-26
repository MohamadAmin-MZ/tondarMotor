const app = require("./app")
const mongoose = require("mongoose")
require("dotenv").config()

const port = process.env.PORT;

console.log(port);

(async () => {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("mongose connected.");
})()


app.listen(port, "0.0.0.0", () => {
    console.log(`server runing on port: ${port}`);
})

