# YelpCamp APP

## Initial Setup
* Add Langing Page
* Add Campground Page that lists all campgrounds

Each Campground has:
  * Name
  * Image

## Layout and Basic Styling
* Create header and footer
* Add in Bootstrap3

## Creating New Campgrouds
* Setup new campground POST route (to receive data from the form)
* Add in body-parser(to get the req.body contents)
* Setup route to show form (/new) -- action:"/campgrounds"
* Add bassic unstyled form

## Style the campgrounds page
* Add a better header/title 
* Make campgournds dispay in grid (Bootstrap3)
//container//jumbotron//btn||row(display:flex)//col-md-3//thumbnail//caption


## Sytle the NavBar and Form 
* Add a navbar to all templates

```
<nav class="navbar navbar-default">
     <div class="container-fluid">
         <div class="navbar-header">
             <a class="navbar-brand" href="/">Yelp Camp</a>
         </div>  
         <div class="collapse navbar-collapse">
             <ul class="nav navbar-nav navbar-right">
                 <li><a href="/">Login</a></li>
                 <li><a href="/">Sign Up</a></li>
                 <li><a href="/">Logout</a></li>
             </ul>
         </div>
     </div>
 </nav>
 ```

* Style the new camground form (inline sytling is just a temp. method)

```
<div class="container">
    <div class="row">
     <h1 style="text-align: center;">Create a NEW Campground</h1>
     <div style="width:30%; margin:40px auto; ">
          <form action="/campgrounds" method="POST">
              <div class="form-group">
                  <input class="form-control" type="text" name="name" placeholder="Name">
              </div>
              <div class="form-group">
                  <input class="form-control" tpye="text" name="image" placeholder="image URL">
              </div>
              <div class="form-group">
                  <button class="btn btn-lg btn-default btn-primary btn-block" type="submit">Submit!</button>
              </div>
          </form>
                 <a href="/campgrounds">Back</a>
      </div>
    </div>
</div>
```

## Add Mongoose
* Install and configure mongoose
* Install Database in workplace (MongoDB):
```
$ sudo apt-get install -y mongodb-org

```
* Running MongoDB on a Cloud9 workspace
```
$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod
```

* You can start mongodb by running the mongod script on your project root:
```
$ ./mongod 
```
* IF you accidiently shutdown mongoDB and face the "Unclean shutdown detected" problem:
```
killall mongod ; cd ; ./mongod --repair ; cd data ; rm -rf mongod.lock ; cd ; ./mongod
```
* Setup campground model
```
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

```

* To see the dbs
```
db.campgrounds.find()
{ "_id" : ObjectId("59f0f844c9b40220ae8c8fc3"), "name" : "YinMing Mountain", "image" : "https://photosforclass.com/download/5641024448", "__v" : 0 }
```


* Use campground model inside of our routes
```
app.get("/campgrounds",function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds",{campgrounds:allCampgrounds});
        }
    })
});

```
```
app.post("/campgrounds",function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
    
});
```
## Show Page
* Review the RESTful routes I've created so far
* NEW/CREATE/SHOW/EDIT/UPDATE/DESTORY
* Add description to my campground model
```
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});
```
* Show db.collection.drop() - if you made a huge change
* Add a show route/template // findById()
```
app.get("/campgrounds/:id",function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("show", {campground: foundCampground});
            }
    });
});
```
* Give an ancher tag in the index page
```
 <p>
     <a href="/campgrounds/<%= campground._id %>" class="btn btn-primary" > More Info</a>
 </p>
```



## Refactor Mongoose Code
* Create a models directory (campground.js)
```
var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
module.exports = mongoose.model("Campground", campgroundSchema);
```
* Use modeule exports and require everything correctly
```
Campground = requie("./models/campground")
```
## Add Seeds File (To text if the comment function adding later will work well)
* Add a seeds.js file - 1. Remove all Campgrouds
```
var mongoose = require("mongoose");
var Campground = require("./models/campground");

function seedDB(){
    Campground.remove({},function(err){
        if(!err){
        console.log("remove campgournds!");
        }
    });    
}

module.exports = seedDB;
```
* Add a seeds.js file - 2. Add a few Campgrouds (into the remove)
```
var data =[
    {
        name: "Cloud's Rest",
        image:"http://www.visitnc.com/contents/imgcrop/60726/1200/630/preview",
        description:"Pretty Aweseom like that place!"
    },
    {
        name: "MinTang's Camp",
        image:"http://www.visitnc.com/contents/imgcrop/61803/1200/630/preview",
        description:"Great place I've never been to. Recommented!"
    },
    {
        name: "SkyCrapper Paradas",
        image:"https://greatist.com/sites/default/files/styles/fb-1200x630/public/Campsite_featured.jpg?itok=UJly7Ji0",
        description:"Blah! Blah lah lha lha Blah!!!"
    }
    ]
=================================
function seedDB(){
    // Remove all campgrounds
    Campground.remove({},function(err){
        if(!err){
            console.log("remove campgournds!");
            // Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err,data){
                    if(!err){
                        console.log("add a campground");
                    }
                }); // create
            }); // data.forEach
        }// not err
    });//remove
}

```
* Add a seeds.js file - 3. Add a few Comments
```
Comment.create(
    {
        text:"This place is great!",
        auther:"Homer"
    },function(err, comment){
        if(!err){
            campground.comments.push(comment);
            campground.save();
            console.log("Create a new comment!");
        }
    }); // create Comment
```

* Run the seeds file every time the server starts
```
var seedDB      = require("./seeds");

seedDB();    
```

## Add Commemt

* Add Comment Model
```
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    author: String
});

module.exports = mongoose.model("Comment",commentSchema);

```

* Display comments on campground SHOW page -/ populate / exec
```
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("show", {campground: foundCampground});
            }
    });
    
```

