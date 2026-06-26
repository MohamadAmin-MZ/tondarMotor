const Validator = require("fastest-validator")

const v = new Validator()

const schema = {
    username: { type: "string", min: 3, max: 100 },
    name: { type: "string", min: 3, max: 255 },
    password: { type: "string", min: 8, max: 25 },
    confirmPassword: { type: "equal", field: "password" },
    $$strict: true
}

const chek = v.compile(schema)

module.exports = chek
