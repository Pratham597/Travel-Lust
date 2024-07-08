//Our Imports.
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore=require('connect-mongo');
const flash = require("connect-flash");
const User = require("./Models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const error = require("./utils/error.js");
require('dotenv').config()

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//Database connection.

const dbURL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbURL);
}

main()
  .then(() => {
    console.log("MongoDb is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//Our Server
const app = express();
const port = 3000;

//Implement session-options.
const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error",()=>{
  console.log('ERROR IN MONGO SESSION STORE');
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



//Templating SetUp
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions)); //Session.
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Flash-Middleware.
app.use((req, res, next) => {
  let success = req.flash("success");
  let error = req.flash("error");
  res.locals.success = success;
  res.locals.error = error;
  res.locals.currUser = req.user;
  next();
});

app.get('/',(req,res)=>{
  res.redirect('/listings');
})

//Routes.
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

//WildCard
app.all("*", (req, res) => {
  throw new error(404, "Page-not-found");
});

//Error Handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

//Port Listener.
app.listen(port, () => {
  console.log("App is listening on port 3000");
});
