const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET, auth } = require('../config');
const User = require('../models/user');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

// passport vs jwt
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
// passport vs google

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: auth.google.CLIENT_ID,
      clientSecret: auth.google.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const user = await User.findOne({ authGoogleID: profile.id, authType: 'google' });
        if (user) return done(null, user);
        // new account
        const newUser = new User({
          authType: 'google',
          authGoogleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

//passport facebook
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: auth.facebook.CLIENT_ID,
      clientSecret: auth.facebook.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ authFacebookID: profile.id, authType: 'facebook' });
        if (user) return done(null, user);
        // new account
        const newUser = new User({
          authType: 'facebook',
          authFacebookID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          userName: profile.name.familyName + ' ' + profile.name.givenName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
