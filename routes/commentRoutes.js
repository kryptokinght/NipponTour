const express = require("express"),
    Comment = require('../models/comment'),
    Tourplaces = require("../models/tourplaces");

var router = express.Router({mergeParams: true});

//new comment
router.get('/new', isLoggedIn, (req, res) => {
    Tourplaces.findById(req.params.id, (err, foundPlace) => {
       if(err) console.log(err);
       else {
           res.render('comments/new', {place: foundPlace});
       }
    });
});

//create comment
router.post('/', (req, res) => {
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

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;