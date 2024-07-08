const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { createReview, destroyReview } = require("../controllers/review.js");
const { validateReview, validateAuthor } = require("../utils/validate.js");
const { auth } = require("../utils/authentication.js");

//New review
router.post("/", auth, validateReview, wrapAsync(createReview));

//Delete a review
router.delete(
  "/:reviewId",
  auth,
  wrapAsync(validateAuthor),
  wrapAsync(destroyReview)
);

module.exports = router;
