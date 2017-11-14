var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

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
router.post("/",middleware.isLoggedIn,function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    geocoder.geocode(req.body.location, function (err, data) {
         if(err){
             console.log(err);
         } else{
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
            Campground.create(newCampground,function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else{
                    console.log(newlyCreated);
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});
    
    
    
    
    //Create a new campground and save to DB


// Campgrounds NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Campgrounds SHOW - show more info about one campground
router.get("/:id",middleware.isLoggedIn, function(req, res){
    //find the campfround with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

//EDIT Campgrounds ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(!err){
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});

//UPDATE Campgrounds ROUTE
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if(err){
        console.log(err);
    } else {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });    
    }
  });
});

//DESTROY Campgrounds ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;