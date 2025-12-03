import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
        const tokenDecod = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecod.id) {
            if (!req.body) req.body = {};
            req.body.userId = tokenDecod.id;
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        next();

    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}

export default userAuth;