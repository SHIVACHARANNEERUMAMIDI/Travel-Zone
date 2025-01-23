// import express from "express";
import Listing from "../models/listing.js";
import mongoose from "mongoose";
import datasample from "./data.js";
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
await main().then(()=>
{
    console.log("connected to databse");
}).catch((err)=>{
    console.log(err);
});
const initdb= async()=>{
await Listing.deleteMany({});
console.log(datasample.data);
await Listing.insertMany(datasample.data);
console.log("data added");
}
initdb();