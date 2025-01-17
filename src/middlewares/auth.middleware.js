// verify user present or not
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const userToken =
            req.cookies?.accessToken || 
            req.header("Authorization")?.replace("Bearer ", "").trim();

        // console.log(userToken);
        // console.log(req.cookies)

        // If no token is found, reject the request
        if (!userToken) {
            throw new ApiError(401, "Unauthorized request. Token is missing.");
        }

        // Verify the token
        const decodedToken = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);

        // Find the user in the database
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token. User not found.");
        }

        // Attach the user object to the request for future use
        req.user = user;
        next();
    } catch (error) {
        // Log the error for debugging
        console.error("JWT Verification Error:", error);

        // Customize error response
        throw new ApiError(401, error?.message || "Invalid or expired access token.");
    }
});