
import connectDB from "./db/index.js";

// require('dotenv').config({path:'./env'}) OLD version

import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})

//database connection
connectDB() //This will return promise as async await always gives promises
.then(
    ()=> {
        app.listen(process.env.PORT|| 8000,()=>{
        console.log(`Server is running at PORT ${process.env.PORT}`);
    })

})
.catch((err)=>{
    console.log("MONGODB connection failed!!!",err);
})









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