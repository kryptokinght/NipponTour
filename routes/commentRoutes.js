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
router.post('/', isLoggedIn, (req, res) => {
  console.log("Comment post route called!!");
   Tourplaces.findById(req.params.id, (err, foundPlace) => {
      if(err){
          console.log(err);
          res.redirect('/places/'+req.params.id);
      }
      else {
          Comment.create(req.body.comment, (err, comment) => {
             if(err) console.log(err);
             else {
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save modified comment
                 comment.save();
                foundPlace.comments.push(comment);
                foundPlace.save((savedPlace) => {
                  console.log("PLACE saved with comment");
                  console.log(savedPlace);
                });
                res.redirect('/places/'+req.params.id);
             }
          });
      }
   });
});


//EDIT - edit comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res, foundPlace) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err)
      res.redirect("back");
    else {
      res.render("comments/edit", {place_id : req.params.id, comment: foundComment});
    }
  });
});

//UPDATE comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err)
            res.redirect("/places/" + req.params.id);
        else {
            res.redirect("/places/" + req.params.id);
        }
    });
});

//delete comment
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
       if(err)
        res.redirect("/places" + req.params.id);
       res.redirect("/places" + req.params.id);
   });
});

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
                res.redirect("back");
            } else {
                //does user own the campground
                if(req.user._id.equals(foundComment.author.id)) {
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
