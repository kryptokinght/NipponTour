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
