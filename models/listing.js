import mongoose, { Schema } from "mongoose";
// const Review = require("./review.js");
import Review from "./review.js";
// import Review from "/models/review.js";


const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://images.pexels.com/photos/2734521/pexels-photo-2734521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        set: (v) => v === "" ? "https://images.pexels.com/photos/2734521/pexels-photo-2734521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" : v,
    },
    price: {
        type: Number, // Ensure price is a number
        required: true
    },
    location:{
    type: String,
    required: true
    },
    country:{
    type: String,
    required: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }]
});

const Listing = mongoose.model("Listing", schema);
export default Listing;