var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

// Campgournds Index
router.get("/",function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//  Campgrounds CREATE - add new campgrounds to DB
router.post("/",function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name,image:image,description:description};
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

// Campgrounds NEW - show form to create new campground
router.get("/new",function(req, res){
    res.render("campgrounds/new.ejs");
});

// Campgrounds SHOW - show more info about one campground
router.get("/:id",function(req, res){
    //find the campfround with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

module.exports = router;