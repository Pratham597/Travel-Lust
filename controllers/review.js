const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

const createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let data = req.body.review;
  let review = new Review(data);
  listing.reviews.push(review);
  review.author = req.user._id;
  await listing.save();
  let saveReview = await review.save();
  console.log(saveReview);
  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${id}`);
};

const destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(id);
  let deletedReview = await Review.findByIdAndDelete(reviewId);
  console.log(deletedReview);
  let newListing = await Listing.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { new: true }
  );
  console.log(newListing);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};

module.exports = { createReview, destroyReview };