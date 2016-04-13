module.exports = function(app, passport) {

    // HOME PAGE
    app.get('/', isLoggedInHOMEPAGE, function(req, res) {
        res.render('index.ejs');
    });

    // LOGIN
    app.get('/login', function(req, res) {

        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/menu',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // SIGNUP
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // PROFILE SECTION
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT
    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/menu', isLoggedIn, function(req, res) {
        res.render('menu.ejs');
    });

    app.get('/play', isLoggedIn, function(req, res) {
        res.render('play.ejs', {pseudo: req.user});
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function isLoggedInHOMEPAGE(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/menu');

    return next();
}
