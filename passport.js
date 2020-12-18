const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("./models/user");

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwtHeaderOrCookie;
  opts.secretOrKey = process.env.TOKEN_SECRET;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
      });
    })
  );
};

function ExtractJwtHeaderOrCookie(req) {
  let token = ExtractJwt.fromAuthHeaderWithScheme("jwt")(req);
  if (!token && req && req.cookies) token = req.cookies["jwt"];
  return token;
}
