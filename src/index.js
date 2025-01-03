
import connectDB from "./db/index.js";

// require('dotenv').config({path:'./env'}) OLD version

import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})


connectDB()










/*
import express from "express";
const app=express();
(async ()=> {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
        })


        app.listen(process.env.PORT,()=>{
            console.log(`App is listneing on port ${process.env.PORT0}`)
        })
    }
    catch(error){
        console.error("ERROR:",error)
        throw err

    }
})()
    */