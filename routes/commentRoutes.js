const express = require("express"),
    Comment = require('../models/comment'),
    Tourplaces = require("../models/tourplaces"),
    middleware = require("../middleware");

var router = express.Router({mergeParams: true});

//new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Tourplaces.findById(req.params.id, (err, foundPlace) => {
       if(err) console.log(err);
       else {
           res.render('comments/new', {place: foundPlace});
       }
    });
});

//create comment
router.post('/', middleware.isLoggedIn, (req, res) => {
  console.log("Comment post route called!!");
   Tourplaces.findById(req.params.id, (err, foundPlace) => {
      if(err){
          console.log(err);
          req.flash("error", "Something went wrong");
          res.redirect('/places/'+req.params.id);
      }
      else {
          Comment.create(req.body.comment, (err, comment) => {
             if(err) {
               console.log(err);
               req.flash("error", "Something went wrong");
             }
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
                req.flash("success", "Comment Added");
                res.redirect('/places/'+req.params.id);
             }
          });
      }
   });
});


//EDIT - edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res, foundPlace) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err)
      res.redirect("back");
    else {
      res.render("comments/edit", {place_id : req.params.id, comment: foundComment});
    }
  });
});

//UPDATE comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/places/" + req.params.id);
        }
        else {
            req.flash("success", "Comment edited");
            res.redirect("/places/" + req.params.id);
        }
    });
});

//delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if(err)
            res.redirect("/places/" + req.params.id);
        req.flash("success", "Comment Deleted");      
        res.redirect("/places/" + req.params.id);
   });
});

module.exports = router;
