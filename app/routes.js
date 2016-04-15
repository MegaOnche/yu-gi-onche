var mongoose = require('mongoose');
var Card = require('./models/card.js');

module.exports = function(app, passport) {

  // HOME PAGE
  app.get('/', isLoggedInHOMEPAGE, function(req, res) {
    res.render('index.ejs');
  });

  // LOGIN
  app.get('/login', function(req, res) {

    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/menu',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // SIGNUP
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // PROFILE SECTION
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // LOGOUT
  app.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/menu', isLoggedIn, function(req, res) {
    res.render('menu.ejs', {
      user: req.user
    });
  });

  app.get('/play', isLoggedIn, function(req, res) {
    res.render('play.ejs', {
      pseudo: req.user
    });
  });

  app.get('/admin', isAdmin, function(req, res) {
    res.render('admin.ejs', {
      user: req.user
    });
  });
  app.get('/admin-addcard', isAdmin, function(req, res) {
    res.render('admin-addcard.ejs', {
      user: req.user
    });
  });

  app.post('/admin-addcard', function(req,res){
    addCardToDB(req, res);
  });

  app.get('/admin-rmcard', isAdmin, function(req, res) {
    res.render('admin-rmcard.ejs', {
      message: req.flash('rmCardMessage')
    });
  });
  app.post('/admin-rmcard', function(req,res){
    removeCardFromDB(req, res);
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.status == 2) {
      return next();
    }

    res.redirect('/menu');
  }

  res.redirect('/');
}

function isLoggedInHOMEPAGE(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/menu');

  return next();
}

function addCardToDB(req, res) {
  var newCard = new Card();

  newCard.name = req.body.name;
  newCard.url = req.body.url;
  newCard.cardtype = req.body.cardtype;
  newCard.level = req.body.level;
  newCard.group = req.body.group;
  newCard.id = req.body.id;
  newCard.atk = req.body.atk;
  newCard.def = req.body.def;
  newCard.rarety = req.body.rarety;
  newCard.effect = req.body.effect;

  newCard.save(function(err) {
    if (err)
      console.log('Erreur lors de l\'ajout de la carte dans la BDD.');
    else
      res.redirect('/admin-addcard');
  });
}

function removeCardFromDB(req, res){
  Card.find({ group:req.body.group, id:req.body.id }).remove(function(err){
    res.redirect('/admin-rmcard');
  });
}
