const express = require("express"),
    User = require('../models/user'),
    passport = require("passport");

var router = express.Router();

//root
router.get("/", (req, res) =>{
    console.log("Landing page called!!");
    res.render("LandingPage");
});

//new user
router.get('/register', (req, res) => {
    res.render('register');
});

//create user
router.post('/register', (req, res) => {
   let newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, (err, user) => {
       if(err) {
           console.log(err);
           req.flash("error", err.message);
           return res.redirect('/register');
       }
       passport.authenticate('local')(req, res, function() {
         req.flash("success", "Welcome to NipponTour " + user.username);
           res.redirect('/places');
       })
   });
});

//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/places',
    failureRedirect: '/login'
}), (req, res) => {});

//logout user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("error", "User has been successfully logged out");
    res.redirect('/');
})

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;
