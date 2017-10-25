var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req, res){
    res.render("landing");
})
///
   var campgrounds = [
       {name:"YinMing Mountain", image:"https://photosforclass.com/download/5641024448"},
       {name:"Creep Mountain", image:"https://photosforclass.com/download/14435096036"},
       {name:"YinMing Mountain", image:"https://photosforclass.com/download/5641024448"},
       {name:"Creep Mountain", image:"https://photosforclass.com/download/14435096036"},
       {name:"YinMing Mountain", image:"https://photosforclass.com/download/5641024448"},
       {name:"Creep Mountain", image:"https://photosforclass.com/download/14435096036"},
       {name:"Camping Paradas", image:"https://photosforclass.com/download/15989950903"}
       ];
///

app.get("/campgrounds",function(req, res){

    res.render("campgrounds",{campgrounds:campgrounds});
});

// Fellow the RESTful to have a same path name
app.post("/campgrounds",function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

// give a form to send the data to POST ROUTE||||||

app.get("/campgrounds/new",function(req, res){
    res.render("new.ejs");
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Yelp Camp server is connecting");
});