const mongoose = require("mongoose");
const Review = require("./review.js"); 


const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url:String,
    filename:String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  category:{
    type:String,
    enum:[
      "Trending",
      "Rooms",
      "IconicCity",
      "Mountain",
      "Castles",
      "AmazingPools",
      "Camping",
      "Farms",
      "Arctic",
    ],
    required:true
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Reviews are deleted!!");
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
