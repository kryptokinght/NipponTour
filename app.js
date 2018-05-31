const path = require('path');
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStrategy = require("passport-local"),
    Tourplaces = require('./models/tourplaces'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');    
    
mongoose.connect("mongodb://localhost/nippon_journey", { useMongoClient: true });
mongoose.Promise = global.Promise;

seedDB(); //seed the database with initial data

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//----PASSPORT CONFIGURATION--------------
app.use(require('express-session')({
    secret: "I am a glutton",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.authenticate());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//----ROUTES--------
app.get("/", (req, res) =>{
    console.log("Landing page called!!");    
    res.render("LandingPage"); 
});
app.get("/places",(req, res) =>{
    //get all tourplaces from database
    Tourplaces.find({}, (err, landmarks) =>{
        if(err) console.log("EROROROR!");
        else {
            res.render("tourPlaces/index",{landmarks:landmarks});      
        }
    });
});
app.get("/places/new", (req, res) =>{
   res.render("tourPlaces/new"); 
});

app.post("/places", (req, res) =>{
    var newPlace = req.body.place;
    //create a new tourplace and save to databse
    Tourplaces.create(newPlace, (err, place) =>{
       if (err) console.log("Eror");
       else {
           console.log("Saved!");
           console.log(place);
           res.redirect("/places");
       }
    });
});

//SHOW - shows more info about the tour place
app.get("/places/:id", (req, res) =>{
   //get the description of the place with the id
   Tourplaces.findById(req.params.id).populate('comments').exec((err, foundPlace) => {
      if(err) console.log("Error in show description!");
      else {
        //render the show page for the place
        res.render("tourPlaces/show",{place:foundPlace});       
        console.log(foundPlace);
      }
   });
   
});

//COMMENTS routes
app.get('/places/:id/comments/new', (req, res) => {
    Tourplaces.findById(req.params.id, (err, foundPlace) => {
       if(err) console.log(err);
       else {
           res.render('comments/new', {place: foundPlace});
       }
    });
});
app.post('/places/:id/comments', (req, res) => {
   Tourplaces.findById(req.params.id, (err, foundPlace) => {
      if(err){
          console.log(err);
          res.redirect('/places/'+req.params.id);
      } 
      else {
          Comment.create(req.body.comment, (err, comment) => {
             if(err) console.log(err);
             else {
                foundPlace.comments.push(comment);
                foundPlace.save();
                res.redirect('/places/'+req.params.id);
             }
          });
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Nippon server has started!");
   // console.log(process.env.IP);
});
