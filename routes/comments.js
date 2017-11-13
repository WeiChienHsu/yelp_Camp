var express = require("express");
var router  = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment     =require("../models/comment")

// Comments NEW
router.get("/new", isLoggedIn ,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            res.render("comments/new",{campground,campground});
        }
    });
});
// Comments CREATE
router.post("/",isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Comment EDIT Route
router.get("/:comment_id/edit",function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});

//Comment UPDATE Route
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Delete Route
router.delete("/:comment_id",function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

module.exports = router;