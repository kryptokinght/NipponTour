const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
    
mongoose.connect("mongodb://localhost/nippon_journey", { useMongoClient: true });
mongoose.Promise = global.Promise;

const Tourplaces = require('./models/tourplaces');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
seedDB(); //seed the database with initial data

/*Tourplaces.create({"name" : "Golden Pavilion", "image": "http://cdn.touropia.com/gfx/d/famous-temples/golden_pavilion.jpg?v=9ab0d0d9d29b808ee01a6e488a89500e",
                    "desc" : "This is a palace build during the 1900s by the royal emperors of Japan in favour to Buddha."}
                   , function(err, place) {
        if(err) console.log("Error");
        else {
            console.log("Saved: ");
            console.log(place);
        }
    });
*/
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    console.log("Landing page called!!");    
    res.render("LandingPage"); 
});
app.get("/places",function(req, res) {
    //get all tourplaces from database
    Tourplaces.find({}, function(err, landmarks) {
        if(err) console.log("EROROROR!");
        else {
            res.render("places",{landmarks:landmarks});      
        }
    });
});
app.get("/places/new", function(req, res) {
   res.render("newPlace"); 
});
app.post("/places", function(req, res) { 
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newPlace = {"name" : name, "image" : image, "desc": desc};
    //create a new tourplace and save to databse
    Tourplaces.create(newPlace, function(err, place) {
       if (err) console.log("Eror");
       else {
           console.log("Saved!");
           console.log(place);
           res.redirect("/places");
       }
    });
});

//SHOW - shows more info about the tour place
app.get("/places/:id", function(req, res) {
   //get the description of the place with the id
   Tourplaces.findById(req.params.id, function(err, foundPlace) {
      if(err) console.log("Error in show description!");
      else {
        //render the show page for the place
        res.render("show",{place:foundPlace});       
      }
   });
   
});
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Nippon server has started!");
   // console.log(process.env.IP);
});
