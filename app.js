const path = require('path');
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
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


//----PASSPORT CONFIGURATION--------------
app.use(require('express-session')({
    secret: "I am a glutton",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to send currentUser data
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

app.use("/", indexRouter);
app.use("/places", placesRouter);
app.use("/places/:id/comments", commentRouter);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Nippon server has started on " + process.env.PORT);
   // console.log(process.env.IP);
});
