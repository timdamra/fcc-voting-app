const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../db/User');
var consumerKey, consumerSecret, callbackURL;

if (process.env.NODE_ENV === 'production') {
  consumerKey = process.env.consumerKey;
  consumerSecret = process.env.consumerSecret;
  callbackURL = process.env.callbackURL;
} else {
  consumerKey = require('./appConfig').consumerKey;
  consumerSecret = require('./appConfig').consumerSecret;
  callbackURL = require('./appConfig').callbackURL;
}

const devOptions = {
  consumerKey,
  consumerSecret,
  callbackURL
};

module.exports = passport => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new TwitterStrategy(devOptions, function(
      token,
      tokenSecret,
      profile,
      done
    ) {
      process.nextTick(function() {
        User.findOne({ twitterId: profile.id }, function(err, user) {
          if (err) return done(err);
          if (user) {
            console.log(user);
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.twitterId = profile.id;
            newUser.twitterToken = token;

            newUser.save(function(err) {
              if (err) throw err;
              console.log(newUser);
              return done(null, newUser);
            });
          }
        });
      });
    })
  );
};
