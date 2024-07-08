const Listing = require("../Models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  } else res.render("listings/show.ejs", { listing });
};

const filterListing=async (req, res, next) => {
  let { category } = req.params;
  let array = [
    "Trending",
    "Rooms",
    "IconicCity",
    "Mountain",
    "Castles",
    "AmazingPools",
    "Camping",
    "Farms",
    "Arctic",
  ];
  if (array.indexOf(category) != -1) {
    let listings=await Listing.find({category});
    return res.render('listings/category.ejs',{listings});
  }
  else return next();
}

const searchListing=async (req,res)=>{
  let {q}=req.query;
  let listings=await Listing.find({title:{$regex:q, $options: 'i'}})
  res.render('listings/index.ejs',{listings});
}

const createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query:req.body.listing.location+","+req.body.listing.country ,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url, filename };
  listing.geometry = response.body.features[0].geometry;
  console.log(await listing.save());
  req.flash("success", "Listing Added Successfully");
  res.redirect("/listings");
};

const renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  } else {
    let originalUrl = listing.image.url.replace(
      "/upload",
      "/upload/h_200,w_350"
    );
    console.log(listing);
    res.render("listings/edit.ejs", { listing, originalUrl });
  }
};

const updateListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query:req.body.listing.location+","+req.body.listing.country ,
      limit: 1,
    })
    .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    runValidators: true,
    new: true,
  });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  listing.geometry=response.body.features[0].geometry;
  await listing.save();  
  
  console.log(listing);
  req.flash("success", "Updated Successfully");
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  updateListing,
  renderEditForm,
  destroyListing,
  filterListing,
  searchListing
};
