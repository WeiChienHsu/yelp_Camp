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
            console.log(err);
            res.render("register");
        }
        
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// Login From Route
router.get("/login", function(req, res){
    res.render("login");
})
// Login From Logic Route
router.post("/login", passport.authenticate("local", 
{   
    successRedirect:"/campgrounds",
    failureRedirect:"login" //middleware - authenticated method
}),function(req, res){
});

// Logout Route
router.get("/logout",function(req, res){
    req.logout();
    res.redirect("/campgrounds");
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