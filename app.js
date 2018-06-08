const path = require('path');
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    flash = require('connect-flash'),
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStrategy = require("passport-local"),
    Tourplaces = require('./models/tourplaces'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

const placesRouter = require("./routes/placesRoutes"),
    commentRouter = require("./routes/commentRoutes"),
    indexRouter = require("./routes/indexRoutes");

mongoose.connect("mongodb://localhost/nippon_journey", { useMongoClient: true });
mongoose.Promise = global.Promise;

//seedDB(); //seed the database with initial data

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash());


//----PASSPORT CONFIGURATION--------------
app.use(require('express-session')({
    secret: "I am a glutton",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//test 3
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to send currentUser data
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRouter);
app.use("/places", placesRouter);
app.use("/places/:id/comments", commentRouter);

app.listen(8000, function() {
    console.log("The Nippon server has started on " + 8000);
   // console.log(process.env.IP);
});

/*********END***************/
