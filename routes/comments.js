//==================
//Comments Routes
//==================
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment     =require("../models/comment")


router.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            res.render("comments/new",{campground,campground});
        }
    });
});

router.post("/campgrounds/:id/comments",isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

module.exports = router;