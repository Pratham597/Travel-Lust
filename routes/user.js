const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { auth } = require("../utils/authentication.js");
const { validateUser } = require("../utils/validate.js");
const {
  signUp,
  renderSignUp,
  renderLogin,
  successLogin,
  logOut,
} = require("../controllers/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/authentication.js"); 

router
  .route("/signup")
  .get(renderSignUp)
  .post(validateUser, wrapAsync(signUp));

router
  .route("/login") 
  .get(renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    successLogin
  );

router.get("/logout", auth, logOut);

module.exports = router;
