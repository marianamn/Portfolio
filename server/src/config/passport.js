const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const dataUtils = require("../data/utils/data-utils");
const config = require("./index");

module.exports = passport => {
  let opt = {};

  opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opt.secretOrKey = config.secret;

  passport.use(
    new JwtStrategy(opt, (jwt_payload, done) => {
      dataUtils
        .getById(User, jwt_payload.id)
        .then(user => {
          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        })
        .catch(err => done(err, false));
    })
  );
};
