import mongoose from "mongoose";
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const ReviewSchema=new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
})
const Reviewmodel=mongoose.model("Review",ReviewSchema);
export default Reviewmodel;