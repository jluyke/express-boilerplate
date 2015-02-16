// session helper methods

this.isLoggedIn = function(req) {
  return req.session.passport.user > 0;
};
