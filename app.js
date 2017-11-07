var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),  
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
seedDB();    
//SCHEMA SETUP

//Passport configuration
app.use(require("express-session")({
    secret:"Let's build up a yelp camp",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req, res){
    res.render("landing");
});


// INDEX - show all campgrounds
app.get("/campgrounds",function(req, res){
    // Get All campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
    // res.render("campgrounds",{campgrounds:campgrounds});
});

// CREATE - add new campgrounds to DB
app.post("/campgrounds",function(req, res){
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
    })
    
});


// NEW - show form to create new campground
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new.ejs");
})

    

// SHOW - show more info about one campground
app.get("/campgrounds/:id",function(req, res){
    //find the campfround with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
                
            }
    });


})
//==================
//Comments Routes
//==================

app.get("/campgrounds/:id/comments/new",function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            res.render("comments/new",{campground,campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

//===========
//AUTH ROUTES
//===========

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register",function(req, res){
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

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", 
{   
    successRedirect:"/campgrounds",
    failureRedirect:"login" //middleware - authenticated method
}),function(req, res){
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Yelp Camp server is connecting");
});