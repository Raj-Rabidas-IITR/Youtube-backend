import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken= async(userId)=>{
    try{
        //generate
        const user= await User.findById(userId);
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        //store the refreshtoken into database
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false}) //to disable the required field temporary

        return {accessToken, refreshToken};

    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")

    }
}


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



    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required");
        
    // }
    const sanitizeInput = (field) => field?.trim();
    const sanitizedData = [fullName, email, username, password].map(sanitizeInput);
    
    if (sanitizedData.some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser=await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or Username alreay exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath=req.files.coverImage[0].path
        
    }

    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is Required")
    
    }

    //uplod the file on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);
    
    if (!avatar){
        throw new ApiError(400,"Avatar field is required");
    }


    //entry in database
    const user= await User.create({
        fullName,
        avatar: avatar.url ,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),

    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    );

    

});


const loginUser= asyncHandler(async(req,res)=>{
    // req body-- > data get
    // check username/email exist or not
    // find the user
    // password check ! if correct 
    // access and refresh token
    //send cookie
    //send response 

    const {email,username,password} =req.body

    if(!(username || email)){
        throw new ApiError(400,"Username or Email is required");

    }
    //finding the user exist or not
    const user= await User.findOne({
        $or :[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist");
    }

    //password check 
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credendials");

    }



    //access and refresh token generate

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

    //sending to cokies
    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options={
        httpOnly: true,
        secure:true //so that this can be modified only by server
    }

    return res.
    status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
    )
)


});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export { registerUser,loginUser,logoutUser };