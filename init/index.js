const mongoose = require("mongoose");
const { data } = require("./data.js");
const { coordinates } = require("./coordinate.js");
const Listing = require("../Models/listing.js");
//Database connection.

async function main() {
  await mongoose.connect(
    process.env.dbURL
  );
}

main()
  .then(() => {
    console.log("MongoDb is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  // Empty Database.
  await Listing.deleteMany({});
  // Initialise database..
  for (let i = 0; i < 29; i++) {
    let obj = data[i];
    let arr = [
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
    let random = Math.floor(Math.random() * 9);
    let listing = new Listing({
      ...obj,
      owner: "668bcfca4325d24872d1dd0e",
      geometry: { type: "Point", coordinates: coordinates[i] },
      category: arr[random],
    });
    await listing.save();
  }
};

initDB()
  .then(() => {
    console.log("Data was initialised");
  })
  .catch((err) => {
    console.log(err);
  });
