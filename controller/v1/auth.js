const userModel = require("../../model/v1/user")
const bcrypt = require("bcrypt")
const registerValodator = require("../../validators/register")
const banUserModel = require("../../model/v1/banUser")
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
    try {
        const validationResult = registerValodator(req.body)
        
        if (validationResult || validationResult.length > 0) {
            const err = validationResult[0]
            const errField = err.field

            if (errField === "password") {
                return res.status(422).json({ ok: false, message: "پسورد باید بشتر از 8 کاراکتر باشد.", error: { code: "CONFLICT", field: "password" } })
            }
            if (errField === "confirmPassword") {
                return res.status(422).json({ ok: false, message: "تکرار پسورد اشتباه است.", error: { code: "CONFLICT", field: "password" } })
            }
            if (errField === "name") {
                return res.status(422).json({ ok: false, message: "نام و نام‌خانوادگی فیلد اجباری است و باید حروف باشد.", error: { code: "CONFLICT", field: "name" } })
            }
            if (errField === "username") {
                return res.status(422).json({ ok: false, message: "نام کاربری فیلد اجباری است و باید حروف باشد.", error: { code: "CONFLICT", field: "username" } })
            }
        }

        const { username, name, email, password, phone } = req.body

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(09|\+989)\d{9}$/;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
        const domain = email.split('@')[1];

        if (!allowedDomains.includes(domain)) {
            return res.status(409).json({ ok: false, message: "دامنه ایمیل مجاز نیست.", error: { code: "CONFLICT", field: "email" } });
        }

        if (!emailRegex.test(email)) {
            return res.status(409).json({ ok: false, message: "فرمت ایمیل نادرست است.", error: { code: "CONFLICT", field: "email" } })
        }

        if (!phoneRegex.test(phone)) {
            return res.status(409).json({ ok: false, message: "فرمت شماره نادرست است.", error: { code: "CONFLICT", field: "phone" } })
        }

        const isBanUser = await banUserModel.findOne({ phone: phone })

        if (isBanUser) {
            return res.status(409).json({ ok: false, message: "کاربر بن است.", error: { code: "CONFLICT", field: "phone" } })
        }



        const isUserExists = await userModel.findOne({ $or: [{ username }, { email }, { phone }] })

        if (isUserExists) {
            if (isUserExists.username === username) {
                return res.status(409).json({ ok: false, message: "کاربری قبلا با این نام کاربری ثبت نام کرده.", error: { code: "CONFLICT", field: "username" } });
            }
            if (isUserExists.email === email) {
                return res.status(409).json({ ok: false, message: "کاربری قبلا با این ایمیل ثبت نام کرده.", error: { code: "CONFLICT", field: "email" } });
            }
            if (isUserExists.phone === phone) {
                return res.status(409).json({ ok: false, message: "کاربری قبلا با این شماره ثبت نام کرده.", error: { code: "CONFLICT", field: "phone" } });
            }
        }

        const countOfUser = await userModel.countDocuments()
        const userRole = countOfUser > 0 ? "USER" : "ADMIN"
        const saltRounds = 10
        const userPasswordHash = await bcrypt.hash(password, saltRounds)

        const user = await userModel.create({
            username,
            name,
            email,
            phone,
            password: userPasswordHash,
            role: userRole
        })

        const payload = {
            id: user._id
        };

        const accessUserJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30 day" })

        return res.status(201).json({
            ok: true,
            message: "User registered successfully.",
            token: accessUserJwt,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error)
        return res.status(500).json({ message: "An internal server error occurred during registration." })
    }
}

const login = async (req, res) => {
    try {

        const { identifier, password } = req.body

        if (!identifier || identifier === "") {
            return res.status(400).json({ ok: false, message: "لطفا شناسه را وارد کنید.", error: { code: "CONFLICT", field: "identifier" } })
        }

        if (!identifier || typeof identifier !== "string" || identifier.trim().length < 3) {
            return res.status(400).json({ ok: false, message: "شناسه نامعتبر است. لطفاً یک شناسه معتبر وارد کنید.", error: { code: "CONFLICT", field: "identifier" } })
        }

        if (!password || password === "") {
            return res.status(400).json({ ok: false, message: "لطفا رمز را وارد کنید.", error: { code: "CONFLICT", field: "password" } })
        }

        if (!password || typeof password !== "string" || password.trim().length < 3) {
            return res.status(401).json({ ok: false, message: "رمز نامعتبر است. لطفاً  رمز معتبری وارد کنید.", error: { code: "CONFLICT", field: "password" } })
        }

        const user = await userModel.findOne({ $or: [{ username: identifier }, { email: identifier }] })

        if (!user) {
            return res.status(401).json({ ok: false, message: "کاربر با این مشخصات وجود ندارد.", error: { code: "CONFLICT" } })
        }

        const isBanUser = await banUserModel.findOne({ phone: user.phone })

        if (isBanUser) {
            return res.status(409).json({ ok: false, message: "کاربری با این مشخصات بن است.", error: { code: "CONFLICT", field: "identifier" } })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ ok: false, message: "رمز اشتباه است.", error: { code: "CONFLICT", field: "password" } })
        }

        const payload = {
            id: user._id
        };

        const accessUserJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30 day" })

        return res.status(200).json({
            ok: true,
            mesaage: "Login Is Successfully.",
            token: accessUserJwt
        })

    } catch (error) {
        console.error("login erorr", error)
        return res.status(500).json({ message: "An internal server error occurred during registration." })
    }

}


module.exports = {
    register,
    login
}