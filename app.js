import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import EJSMate from "ejs-mate";
import path from "path";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressErrors.js";
import schema1 from "./validationschema.js";
import review from "./models/review.js";
import bodyParser from "body-parser";

const dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).substring(1));
const app = express();

app.engine("ejs", EJSMate);
app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(dirname, "/public")));
app.use(bodyParser.json());

let port = 3000;

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

await main()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

// Edit Listing Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const resu = await Listing.findById(id);
    res.render("listing/edit.ejs", { result: resu });
}));
app.get("/listing/new",(req,res)=>
{
    // res.send("hello world");
    res.render("listing/newform.ejs");
})

// Add Review to Listing Route
app.post("/listing/:id/reviews", wrapAsync(async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    // Create a new review document
    const review1 = new review(data.review);
    await review1.save();

    console.log("Review saved successfully");

    let listingdata = await Listing.findById(id);
    listingdata.reviews.push(review1._id);  // Push the review's ObjectId
    await listingdata.save();

    console.log("Review added to the listing");

    // Redirect to the listing page
    res.redirect(`/listing/${id}`);
}));

// Update Listing Route
app.put("/listing/:id", wrapAsync(async (req, res, next) => {
    const result = schema1.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}));

// Create New Listing Route
app.post("/listing/addnew", wrapAsync(async (req, res) => {
    const listing = req.body;
    const result = schema1.validate(listing);
    if (result.error) {
        throw new ExpressError(400, result.error.message);
    }
    const newListing = new Listing(listing.listing);
    await newListing.save();
    res.redirect("/listing");
}));

// Show Listing Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findById(id).populate("reviews");  // Use `.populate()` to populate the reviews
    res.render("listing/show.ejs", { result });
}));

// Show All Listings Route
app.get("/listing", (req, res) => {
    Listing.find().then((resu) => {
        res.render("listing/showtitles.ejs", { resu });
    });
});

// Delete Listing Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// Default Route
app.get("/", (req, res) => {
    res.send("hello I am Shiva Charan");
});

// Error Handling Middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).render("listing/error.ejs", { message });
});

app.listen(port, () => {
    console.log("App is working at port " + port);
});
