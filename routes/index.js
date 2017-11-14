var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user")

// Root Route
router.get("/",function(req, res){
    res.render("landing");
});

// Register From Route
router.get("/register", function(req, res){
    res.render("register");
});
// Signip Logic Route
router.post("/register",function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login From Route
router.get("/login", function(req, res){
    res.render("login");
});
// Login From Logic Route
router.post("/login", function(req, res, next){
    passport.authenticate("local", 
    {   
        successRedirect:"/campgrounds",
        failureRedirect:"login",
        successFlash: "Welcome " + req.body.username + "!"
    })(req, res);
}) ;

// Logout Route
router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});



module.exports = router;