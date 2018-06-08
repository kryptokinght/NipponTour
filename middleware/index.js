const Comment = require('../models/comment'),
      Tourplaces = require('../models/tourplaces');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated())
        return next();
    req.flash("error", "You must be logged in");
    res.redirect('/login');
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                //does user own the campground
                if(req.user._id.equals(foundComment.author.id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have the authorization");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You must be logged in");
        res.redirect("back");
    }
}

middlewareObj.checkPlaceOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Tourplaces.findById(req.params.id, (err, foundPlace) => {
            if(err) {
                console.log(err);
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                //does user own the campground
                if(req.user._id.equals(foundPlace.author.id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have the authorization");
                    res.redirect("back");
                }

            }
        });
    }
    else {
        req.flash("error", "You must be logged in");
        res.redirect("back");
    }
}

module.exports = middlewareObj;
