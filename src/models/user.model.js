import mongoose,{Schema} from "mongoose";



const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //used for searching

    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        trim:true,


    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true, //used for searching

    },
    avatar:{
        type:String, //cloudinary url
        required: true,
    },
    coverImage:{
        type:String

    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref:"Video",
    
    }],

    password:{
        type:String,
        required:[true,"Password is required!"],

    },
    refreshTokem:{
        type:String,
    }
    




},{timeseries:true})


export const User= mongoose.model("User",userSchema)