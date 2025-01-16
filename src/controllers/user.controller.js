import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    //--> algorithm 
    //get user details from frontend
    //validation- not empty 
    //check if user already already exist : Username/email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refreshToken field from response
    //check for user creation successfully or not
    //return res

    const {fullName,email,username,password}=req.body

    console.log("email:",email);







});

export { registerUser };