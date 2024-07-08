const User = require("../Models/user.js");

const renderSignUp=(req, res) => {
  res.render("users/signup.ejs");
}

const signUp = async (req, res) => {
  try {
    let userData = req.body;
    let user = new User(userData);
    let saveUser = await User.register(user, userData.password);

    req.login(saveUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "SignUp successfully");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", "Username or Email exists!");
    res.redirect("/signup");
  }
};

const renderLogin=(req, res) => {
  res.render("users/login.ejs");
}

const successLogin=(req, res) => {
  req.flash("success", "Welcome again to Wanderlust");
  res.redirect(res.locals.redirectUrl);
}

const logOut=(req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successfully");
    res.redirect("/listings");
  });
}

module.exports = {signUp,renderSignUp,renderLogin,successLogin,logOut};
