const Comment = require('../models/comment'),
      Tourplaces = require('../models/tourplaces');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated())
        return next();
    req.flash("error", "Login First!");
    res.redirect('/login');
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
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

middlewareObj.checkPlaceOwnership = function(req, res, next) {
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

module.exports = middlewareObj;
