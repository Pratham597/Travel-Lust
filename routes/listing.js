const express = require("express");
const router = express.Router();
const { validateListing, validateOwner } = require("../utils/validate.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { auth } = require("../utils/authentication.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  index,
  renderNewForm,
  showListing,
  createListing,
  updateListing,
  renderEditForm,
  destroyListing,
  filterListing,
  searchListing
} = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    auth,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );

router.get("/new", auth, renderNewForm);

router.get("/:category", wrapAsync(filterListing));

router.get('/search',wrapAsync(searchListing));

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    auth,
    wrapAsync(validateOwner),
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(auth, wrapAsync(validateOwner), wrapAsync(destroyListing));

router.get(
  "/:id/edit",
  auth,
  wrapAsync(validateOwner),
  wrapAsync(renderEditForm)
);

module.exports = router;
