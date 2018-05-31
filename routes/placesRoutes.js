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
router.get("/new", (req, res) =>{
   res.render("tourPlaces/new"); 
});

//create tourPlace
router.post("/", (req, res) =>{
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

module.exports = router;
