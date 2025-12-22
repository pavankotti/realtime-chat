import jwt from "jsonwebtoken";
import UserModel from "../modals/userModel.js";
import expressAsyncHandler from "express-async-handler";

export const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by id and exclude password
            req.user = await UserModel.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
