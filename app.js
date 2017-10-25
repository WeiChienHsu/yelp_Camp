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
    image:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({
//     name:"Creep Mountain", 
//     image:"https://photosforclass.com/download/14435096036"
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



app.get("/campgrounds",function(req, res){
    // Get All campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds",{campgrounds:allCampgrounds});
        }
    })
    // res.render("campgrounds",{campgrounds:campgrounds});
});

// Fellow the RESTful to have a same path name
app.post("/campgrounds",function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
    
});

// give a form to send the data to POST ROUTE||||||

app.get("/campgrounds/new",function(req, res){
    res.render("new.ejs");
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Yelp Camp server is connecting");
});