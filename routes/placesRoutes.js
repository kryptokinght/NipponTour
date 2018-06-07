const express = require("express"),
    Tourplaces = require('../models/tourplaces');

var router = express.Router();

//all tourPlaces
router.get("/",(req, res) =>{
    //get all tourplaces from database
    Tourplaces.find({}, (err, landmarks) =>{
        if(err) console.log("EROROROR!");
        else {
            res.render("tourPlaces/index",{landmarks:landmarks});      
        }
    });
});

//new tourPlace
router.get("/new", isLoggedIn, (req, res) =>{
   res.render("tourPlaces/new"); 
});

//create tourPlace
router.post("/", isLoggedIn, (req, res) =>{
    var newPlace = req.body.place;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    newPlace.author = author;
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
router.get("/:id", (req, res) =>{
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

//EDIT - edit tourplace
router.get("/:id/edit", checkPlaceOwnership, (req, res, foundPlace) => {
    Tourplaces.findById(req.params.id, (err, foundPlace)=> {
        res.render("tourPlaces/edit", {place: foundPlace});    
    });
    
    
});

//UPDATE tourplace
router.put('/:id', checkPlaceOwnership, (req, res) => {
    Tourplaces.findByIdAndUpdate(req.params.id, req.body.place, (err, updatedPlace) => {
        if(err)
            res.redirect("/places/" + req.params.id);
        else {
            res.redirect("/places/" + req.params.id);
        }
    });
});

//delete campground
router.delete('/:id', checkPlaceOwnership, (req, res) => {
   Tourplaces.findByIdAndRemove(req.params.id, (err, deletedPlace) => {
       if(err)
        res.redirect("/places" + req.params.id);
       res.redirect("/places");
   }); 
});


//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function checkPlaceOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Tourplaces.findById(req.params.id, (err, foundPlace) => {
            if(err) {
                console.log(err);
                res.redirect("back");
            } else {
                //does user own the campground
                if(req.user._id.equals(foundPlace.author.id)) {
                    next();    
                }
                else {
                    res.redirect("back");
                }
                         
            }
        });    
    }
    else {
        res.redirect("back");
    }
}

module.exports = router;
