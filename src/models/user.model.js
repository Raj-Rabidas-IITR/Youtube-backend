import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";


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



// built in hooks 
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,10)
    next()
    
})


// custom hooks 
userSchema.methods.isPasswordCorrect=async function (password) {
   return await bcrypt.compare(password,this.password)


    
}


export const User= mongoose.model("User",userSchema);