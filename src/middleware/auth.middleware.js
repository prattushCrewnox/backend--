import asyncHandler from "../utils/ayncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'
export const verifyAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(401, "Authentication token is missing")
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid token")
    }
    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "User associated with token not found.");
    }
    req.user = user;
    next()
})