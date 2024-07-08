const { listingSchema, reviewSchema, userSchema } = require("../schema.js");
const errors = require("./error.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let allmsg = error.details.map((obj) => obj.message).join(" ");
    throw new errors(400, allmsg);
  } else next();
};

const validateReview = (req, res, next) => {
  let review = req.body;
  let { error } = reviewSchema.validate(review);
  if (error) {
    let allmsg = error.details.map((obj) => obj.message).join(" ");
    throw new errors(400, allmsg);
  } else next();
};

const validateUser = (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    let allmsg = error.details.map((obj) => obj.message).join(" ");
    throw new errors(400, allmsg);
  } else next();
};

const validateOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (listing && req.user._id.equals(listing.owner)) return next();
  req.flash("error", "You are not owner of this listing!");
  res.redirect(`/listings/${id}`);
};

const validateAuthor = async (req, res, next) => {
  let userId = req.user._id;
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (review && userId.equals(review.author)) return next();
  req.flash("error", "You are not permitted!");
  res.redirect(`/listings/${id}`);
};
module.exports = {
  validateListing,
  validateReview,
  validateUser,
  validateOwner,
  validateAuthor,
};
