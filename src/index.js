
import connectDB from "./db/index.js";
import { app } from './app.js';
// require('dotenv').config({path:'./env'}) OLD version
// import {app} from './app.js';
import dotenv from "dotenv";
import express from "express"

dotenv.config({
    path:'./env'
})



// Database connection
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at PORT ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB connection failed!!!", err);
    });






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