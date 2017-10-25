var express = require("express");
var app = express();

app.set("view engine","ejs")

app.get("/",function(req, res){
    res.render("landing");
})

app.get("/campgrounds",function(req, res){
   var campgrounds = [
       {name:"YinMing Mountain", image:"http://photosforclass.com/download/1342367857"},
       {name:"Creep Mountain", image:"http://photosforclass.com/download/15989950903"},
       {name:"Camping Paradas", image:"http://photosforclass.com/download/5641024448"}
       ];
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Yelp Camp server is connecting");
});