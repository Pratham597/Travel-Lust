const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Auth Failed!");
  req.session.redirect = { url: req.originalUrl, method: req.method };
  req.flash("error", "Login/Sign up required!");
  res.redirect("/login");
};

const saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl =
    req.session.redirect &&
    req.session.redirect.url &&
    req.session.redirect.method === "GET"
      ? req.session.redirect.url
      : "/listings";
  return next();
};

module.exports = { auth, saveRedirectUrl };
