var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport) {
  // passport session setup
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // LOCAL SIGNUP
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'pseudo',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        User.findOne({
          'local.username': username
        }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash('signupMessage', 'Ce pseudo existe déjà.'));
          } else {
            User.findOne({
              'local.email': req.body.email
            }, function(err, email) {
              // return any error
              if (err)
                return done(err);

              if (email) {
                return done(null, false, req.flash('signupMessage', 'Cette email existe déjà.'));
              } else {
                var newUser = new User();

                newUser.local.username = username;
                newUser.local.email = req.body.email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.status = 0;
                newUser.local.deck = [];

                newUser.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }
            });
          }
        });
      });
    }));


  // LOCAL LOGIN
  passport.use('local-login', new LocalStrategy({
      pseudoField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'local.username': username
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', 'Le pseudo n\'existe pas.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Mauvais mot de passe.'));

        return done(null, user);
      });

    }));
  // ADD CARD
  // passport.use('admin-addcard', new LocalStrategy({
  //     // usernameField: 'username',
  //     passwordField: 'password',
  //     passReqToCallback: true
  //   },
  //   function(req, username, password, done) {
  //     process.nextTick(function() {
  //       Card.findOne({
  //         'cardname': req.body.username
  //       }, function(err, user) {
  //         if (err)
  //           return done(err);
  //
  //         if (user) {
  //           return done(null, false, req.flash('signupMessage', 'Ce pseudo existe déjà.'));
  //         } else {
  //           // return any error
  //           if (err)
  //             return done(err);
  //
  //           var newCard = new Card();
  //
  //
  //
  //         }
  //       });
  //     });
  //   }));

};
