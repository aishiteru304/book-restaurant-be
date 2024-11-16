import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {

        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Bạn phải xác thực quyền admin" })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Bạn phải xác thực quyền admin" })

        }
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Lỗi rùi bà ơi " })
    }
}

export default adminAuth