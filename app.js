var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({
//     name:"PanDora Mountain", 
//     image:"https://photosforclass.com/download/14435096036",
//     description:"This is a huge granite hill, no bathroom, no water. Beautiful granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("Newly Created Campground");
//             console.log(campground);
//         }
//     });
//////////


app.get("/",function(req, res){
    res.render("landing");
})


// INDEX - show all campgrounds
app.get("/campgrounds",function(req, res){
    // Get All campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds:allCampgrounds});
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
    res.render("new.ejs");
})

// SHOW - show more info about one campground
app.get("/campgrounds/:id",function(req, res){
    //find the campfround with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("show", {campground: foundCampground});
            }
    });


})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Yelp Camp server is connecting");
});