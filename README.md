# YelpCamp APP

App Demo:  https://yelpcamp-wei.herokuapp.com/

## Introduction
* YelpCamp is a multi-user web app that I made to explore the power of Node.js, Express, MongoDB and npm packages. This app features secured user signup and login functions and allows logged-in users to post, edit and delete campgrounds. Users can also post, edit and delete comments for each campground. Users can give addresses to campgrounds and have their locations shown on a Google Map. This app also features beautiful images which slow it down significantly since I'm using free database and server hosts.
* environment: Node.Js

## Features:

* Hosted on Heroku servers
* Non-relational database (MongoDB)
* Mongoose for configuring MongoDB models
* Database hosted on mLab
* Node.js used as environment for writing server-side code
* Express for handling routes
* Method-Override for handling update and delete functions
* EJS for templating
* Passport.js for password hash and salt
* Express-Sessions for configuring cookies
* Geocoder with Google Maps API for rendering locations of campsites
* Flash messages to notify errors when User is redirected from a page
* Bootstrap to provide responsive design that is great on mobile

## Dependencies

```
    "body-parser": "^1.18.2",
    "connect-flash": "^0.1.1",
    "ejs": "^2.5.7",
    "express": "^4.16.2",
    "express-session": "^1.15.6",
    "geocoder": "^0.2.3",
    "method-override": "^2.3.10",
    "moment": "^2.19.2",
    "mongoose": "^4.12.4",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^4.4.0"
```

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
* **** There is an error - After every server restart/database reseed, seed refresh the campgrounds index page to get the new campground ids. If you try to reload a show page while on an old campground when you restart the server, it will throw an error because the old campgrounds get deleted with seedDB() when server restarts.**** 
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

* Display comments on campground SHOW page -/ **populate / exec
```
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
                res.render("show", {campground: foundCampground});
            }
    });
    
```

## NEW & CREATE ROUTE for Comment
* Nested ROUTES
```
INDEX  /campgrounds
NEW    /campgrounds/new
CREATE /campgrounds
SHOW   /campgrounds/:id

NEW    /campgrounds/:id/comments/new   GET
CREATE /campgrounds/:id/comments       POST
```
* Add the Comment NEW and CREATE routes
```
 app.get("/campgrounds/:id/comments/new",function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(!err){
            res.render("comments/new",{campground,campground});
        }
    });
});
 
```
* Lookup Campground using ID -> Create new comment -> Connect new comment to Campground -> Redirect to campgournd show page
```
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

```

* Add the new Comment Form
```
<% include ../partials/header %>
<div class="container">
    <div class="row">
     <h1 style="text-align: center;">Add New Comment to <%=campground.name %></h1>
     <div style="width:30%; margin:40px auto; ">
          <form action="/campgrounds/<%=campground._id %>/comments" method="POST">
              <div class="form-group">
                  <input class="form-control" type="text" name="comment[text]" placeholder="text">
              </div>
              <div class="form-group">
                  <input class="form-control" tpye="text" name="comment[author]" placeholder="author">
              </div>
              <div class="form-group">
                  <button class="btn btn-lg btn-default btn-primary btn-block" type="submit">Submit!</button>
              </div>
          </form>
                 <a href="/campgrounds">Back</a>
      </div>
    </div>
</div>
<% include ../partials/footer %>

<p>
    <a class="btn btn-success" href="/campgrounds/<%= campground._id %>/comments/new">Add New Comment</a>
</p>

```

## Style Show Page
* Add Sidebar to show page
```
	<nav class="navbar navbar-default">
     <div class="container-fluid">
         <div class="navbar-header">
             <a class="navbar-brand" href="/">Yelp Camp</a>
         </div>  
         <div class="collapse navbar-collapse">
             <ul class="nav navbar-nav navbar-right">
                 <!--if User is undefined-->
              <% if(!currentUser){ %>
                 <li><a href="/login">Login</a></li>
                 <li><a href="/register">Sign Up</a></li>
              <% } else { %>
                 <!--if User is defined-->
                 <li><a href="#"> Singed In As <strong><%=currentUser.username %></strong></a></li>
                 <li><a href="/logout">Logout</a></li>
              <% } %>
             </ul>
         </div>
     </div>
 </nav>
```
* Custimaize CSS
```
app.use(express.static(__dirname + "/public"));
```
```
<div class="container">
    <div class="row">
        <div class="col-md-3">
            <p class="lead">YelpCamp</p>
            <div class="list-group">
                <li class="list-group-item active"> Info 1 </li>
                <li class="list-group-item"> Info 1 </li>
                <li class="list-group-item"> Info 1 </li>
            </div>
        </div>
        <div class="col-md-9">
            <div class="thumbnail">
                <img class="img-responsive" src="<%= campground.image %>">
                <div class="caption-full">
                    <h4 class="pull-right">$9.00$/night</h4>
                    <h3><a><%=campground.name %></a></h3>
                    <p><%= campground.description%></p>
                </div>
            </div>
            <div class="well">
                <div class="text-right">
                    <p>
                        <a class="btn btn-success" href="/campgrounds/<%= campground._id %>/comments/new">Add New Comment</a>
                    </p>
                </div>
                <hr>
                <% campground.comments.forEach(function(comment){ %>
                    <div class="row">
                        <div class="col-md-12">
                            <strong><%=comment.author%></strong>
                            <span class="pull-right"> 10 days ago</span>
                            <p>
                                 <%=comment.text%>
                            </p>
                        </div>
                    </div>
                <% }) %>    
            </div>
        </div>
    </div>
</div>

```

## User Authentication

* Add User Model - install packages / passport/ passport-local/ passport-local-mongoose/ express-session
```
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
```

* Register - Configure Passport
```
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
```
* Add Register Routes / Templates
```
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register",function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register"); // if input the same one
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });
})

```
* Add Login Routes / Templates (//middleware - authenticated method)
```
app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", 
{   
    successRedirect:"/campgrounds",
    failureRedirect:"login" 
}),function(req, res){
});

```

* Add Lougout Routes
```
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/campground");
})
```
* Prevent user from adding comments without signin
```
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

```
* Add in the get Route that you need to check if it is logged in
```
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
app.post("/campgrounds/:id/comments",isLoggedIn , function(req, res){

```

* Show / Hide auth Links in navbar correctly - When SignIn only see Logout.
```
in the GET campgrounds ROUTE, add a variable currentUser:
 res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
```
* Pass currentUser variables to every single ROUTE which has a navbar (middleware)
```
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
```
* See the Current User Name
```
  <li><a href="#"> Singed In As <strong><%=currentUser.username %></strong></a></li>
```

## Refactor ROUTES

* Seperate to index.js / comments.js / campgrounds.js
* Used express Router
```
var express = require("express");
var router  = express.Router();

module.exports = router;
```
* Imported Routes

```
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")
 
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes); 
  
```

* Set up (adding require) each js file
```
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user")


```
* Shorten the Routes (Route decricaion)
```
app.use("/campgrounds",campgroundRoutes);
router.get("/",function(req, res){
router.post("/",function(req, res){
router.get("/new",function(req, res){
router.get("/:id",function(req, res){

```
* Solve the problem of none-loading req.params.id
```
var router  = express.Router({mergeParams:true});
```

## Associtates Users and Commtents
* Change the model of comments
```
var commentSchema = mongoose.Schema({
    text:String,
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

```
* Save the User data into comment model by changing comment Route
```
comment.author.id = req.user._id;
comment.author.username = req.user.username;
comment.save();
```
* Change the show page of campgrounds
```
<strong><%=comment.author.username %></strong>
```
## Save Username and Id to newly created campground

* Provent someone isn't login to comment
```
add isLoggedIn function in the campgournds.js file and in the middleware
```
* Change the models of campgrounds
```
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
```
* Add in campgrounds Post ROUTE 
```
var author = {
        id: req.user._id,
        username: req.user.username
    };
    
var newCampground = {name:name,image:image,description:description,author:author};

Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });

```
* Show the username in show page
```
<p>
    <em>Submitted By <%= campground.author.username%></em>
</p>
```
## EDIT Campgournds

* Add Method-Override (Since we need to use PUT Method for UPDATE Route)
```
npm install method-override --save

methodOverride  = require("method-override")
app.use(methodOverride("_method"));
```
* Add Edit Route for Campgrounds (GET)
 - Used findById() to send the specific campground id to edit page
```
router.get("/:id/edit",function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
          res.redirect("/campgrounds");
      } else{
            res.render("campgrounds/edit",{campground:foundCampground});  
      }
    });
});
```
- In campgournd form action, we need to use PUT Method to handle update request
```
<form action="/campgrounds/<%=campground._id%>/?_method=PUT" method="POST">
```
- Then, fill in the data of original info by changing the placeholder into value
```
value="<%= campground.name%>"
```
* Add Update Route (PUT)
 - Group all info from edit page into a single Object
```
name="campground[name]"
```
 - Used findByIdAndUpdate() 
```
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

```
## Delete Campgournds
- Add Delete Button as a form since we need to use action attribute to send a Delete Request (With a delete confirmation)
```
<form action="/campgrounds/<%=campground._id%>/?_method=DELETE" method="POST">
    <button onclick="return confirm('Are you sure you want to delete this campground?');" class="btn btn-danger">Delete</button>                        
</form>
```
-Add Destroy Route
```
router.delete("/:id",function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

```
## Authorization
* User can only edit / delete his campgrounds
 - Check if user is logged in or not (Authentication)
 - Check if user owns the campground (Authorization)
 - "foundCampground.author.id" is an Object and "req.user._id" is a String  
 - Used the method provided by mongoose -> . equals()
 - next() for continuouly run findById codes.
```
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){ // if user is logged in
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){ //does user owns the campground
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

```

```
router.get("/:id/edit",checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(!err){
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});
```
* Hide/Show edit and delete buttons (for the best User Experience that you won't see any function which you couldn't use it)
```
 <% if(currentUser && campground.author.id.equals(currentUser._id)){ %>    
    <a class="btn btn-warning" href="/campgrounds/<%= campground._id %>/edit">Edit</a>
    <form id="delete-form"action="/campgrounds/<%=campground._id%>/?_method=DELETE" method="POST">
        <button onclick="return confirm('Are you sure you want to delete this campground?');" class="btn btn-danger">Delete</button>                        
    </form>
<% } %>
```

## Edit Comments
 - We need to add a new comment id 
 - (/campgournds/:id/comments/:comment_id/edit)

* EDIT page (deal with form action)
 - We need to send the value of comment and campground_id(not need to send all ids in the dataset)
```
 <form action="/campgrounds/<%=campground_id %>/comments/<%= comment._id %>/?_method=PUT" method="POST">
              <div class="form-group">
                  <input class="form-control" type="text" name="comment[text]" value="<%= comment.text%>">
              </div>
              <div class="form-group">
                  <button class="btn btn-lg btn-default btn-primary btn-block" type="submit">Submit</button>
              </div>
          </form>
```

* EDIT Button
```
<a class="btn btn-xs btn-warning" 
    href="/campgrounds/<%=campground._id%>/comments/<%=comment._id%>/edit">
       Edit
    </a>
```
* EDIT Route
```
router.get("/:comment_id/edit",function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});
```

* EDIT UPDATE Route
```
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
```

## Delete Comments

 - Delete button
```
<form class="delete-form" action="/campgrounds/<%=campground._id%>/comments/<%=comment._id%>?_method=DELETE" method="POST">
   <input type="submit" class="btn btn-xs btn-danger" value="delete">                              
</form>
```
- Destroy Route
```
router.delete("/:comment_id",function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

```

## Authorization for Comments
```
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){ // if user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){ //does user owns the campground
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
```

```
 <% if(currentUser && comment.author.id.equals(currentUser._id)){ %>  
    <a class="btn btn-xs btn-warning" 
      href="/campgrounds/<%=campground._id%>/comments/<%=comment._id%>/edit">
        Edit
    </a>
    <form class="delete-form" action="/campgrounds/<%=campground._id%>/comments/<%=comment._id%>?_method=DELETE" method="POST">
        <input onclick="return confirm('Are you sure you want to delete this comment?');" type="submit" class="btn btn-xs btn-danger" value="delete">                              
    </form>
<% } %>

```

## Refactor Middleware
 - Open a directory for middle
```
// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment     =require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){ // if user is logged in
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){ //does user owns the campground
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){ // if user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){ //does user owns the campground
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
```
- Fix!!!!!! Bug (if there's not volid id, in the past vision, it couldn't be found on DB and the server will crashdown)
```
if(err || !foundCampground){
```

- Require the middleware (Default to directly require for the index.js)
```
var middleware = require("../middleware");
```

 - add middleware method in the past middleware
 ```
 router.post("/",middleware.isLoggedIn,function(req, res){
 ```
 ## Flash Messages
 * Install and configure connect-flash
```
npm install connect-flash --save
```

* Add method in the middleware (Give an access for next request)
 - req.flash("error","   ");
```
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash("error","Please Login First!");
        res.redirect("/login");
    }
}
```

* Then, handle the "/login" for the error signal
```
router.get("/login", function(req, res){
    res.render("login",{message: req.flash("error")});
});
```
* Next step, go to the view page (login.ejs) to send the message out
* In order to show all error message in all place they should be showed, move the message to header.ejs
```
<h1><%= message %></h1>

```
* But we couldn't just send the message in each singal route, thus we pass message to each local page
```
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("error");
    next();
});

```
* Add message in Logout Route (Always before we redirect user)
```
router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

```

 * Add bootstrap alerts to header (without identifying success or error)
```
 <div class="container">
    <div class="alert alert-danger" role="alert">
        <%= message %> 
    </div>   
 </div>
```
* To seperate error and success messgae, differnate in the app.use
```
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
```
* Modify bootstrap alerts(Add in correct logic)
```
 <div class="container">
    <% if(error && error.length > 0){ %> 
        <div class="alert alert-danger" role="alert">
            <%= error %> 
        </div>   
    <% } %>
    <% if(success && success.length > 0){ %>      
        <div class="alert alert-success" role="alert">
            <%= success %> 
        </div>   
    <% } %>
 </div>
```

* Adding Helpful Errors
 - Comment Route
 ```
 req.flash("success","Successfully added comment");
 req.flash("success","Comment Deleted");
 ```
 - Authentication Route (SignUp)
 ```
 router.post("/register",function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("success",err);
            return res.redirect("/register");
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
 ```
 - Authentication Route (Successfully Login)
 ```
 router.post("/login", function(req, res, next){
    passport.authenticate("local", 
    {   
        successRedirect:"/campgrounds",
        failureRedirect:"login",
        successFlash: "Welcome " + req.body.username + "!"
    })(req, res);
}) ;
 ```
 ## Add a Landing Page
 ```
  <div id="landing-header">
 		<h1>Welcome to YelpCamp!</h1>
		<a href="/campgrounds" class="btn btn-lg btn-success">View All Campgrounds</a>
    </div>
    
    <ul class="slideshow">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
 ```
 * Styling the Landing Page
  - Position the welcome text and view all campgrounds button
 ```
 #landing-header {
  z-index: 1;
  position: relative;
  text-align: center;
  padding-top: 40vh;
}
 ```
 * Styling the unlimited lists
 ```
 .slideshow { 
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}
 ```
 
 * Styling the limited lists
 ```
 .slideshow li { 
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  opacity: 0;
  z-index: 0;
  animation: imageAnimation 50s linear infinite; 
}
 ```
 * Create the keyframes for the animation
 
 ```
 @keyframes imageAnimation { 
  0% { 
    opacity: 0; 
    animation-timing-function: ease-in;
  }
  10% {
    opacity: 1;
    animation-timing-function: ease-out;
  }
  20% {
    opacity: 1
  }
  30% {
    opacity: 0
  }
}
 ```
 
* Add a showder under title and hr
```
#landing-header h1 {
  color: #fff;
  padding-bottom:5px;
  font-size:40px;
  text-shadow: 0px 4px 3px rgba(0,0,0,0.4),
              0px 8px 13px rgba(0,0,0,0.1),
              0px 18px 23px black;
  
}

.page_hr{
  width: 360px;
  border-top:1px solid #f8f8f8;
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

```

## Connect to the Google Map
* Get Google Maps API Key (Remember to set the security after deployment to AWS or Heroku)
```
AIzaSyBq2Y6s_mWuXCIQ9PffE4RLm1YpvXGXXXXX
```
* Add Google Maps scripts to application
```
<script>
  function initMap() {
    var lat = <%= campground.lat %>;
    var lng = <%= campground.lng %>;
    var center = {lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: center,
        scrollwheel: false
    });
    var contentString = `
      <strong><%= campground.name %><br />
      <%= campground.location %></strong>
      <p><%= campground.description %></p>
    `
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }
</script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=API-KEY-HERE&callback=initMap"></script>
```
* Display the campground location in show.ejs
```
<div id="map"></div>

#map {
   height:400px;
   width:100%;
 }
```
* Update campground model
```
var campgroundSchema = new mongoose.Schema({
   name: String,
   price:String,
   image: String,
   description: String,
   location:String,
   lat:Number,
   lng:Number,
```
* Update new and edit forms
```
<div class="form-group">
  <label for="location">Location</label>
  <input class="form-control" tpye="text" name="location" id="location" value="<%= campground.location %>" pattern='/[$-/:-?{-~!"^_`\[\]]/' required title="No special characters allowed">
</div>
```
* Update campground routes
```
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
    
```

```
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
```
## Styling Navbar and Singup form
 - Firstly, move the div .container to the header and footer file and remove ones in the views file
 - Bootstrap Login page
 ```
 Same as Edit form (add an additional Labels)
 ```
 - Password Confirm
 ```
 <script>
 var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
 ```
 - Add hamburger
 ```
<nav class="navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>

            <a class="navbar-brand" href="/">YelpCamp</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="<%= typeof page !== 'undefined' && page === 'campgrounds' ? 'active' : '' %>"><a href="/campgrounds">Home</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
              <% if(!currentUser){ %>
                  <li class="<%= typeof page !== 'undefined' && page === 'login' ? 'active' : '' %>"><a href="/login">Login</a></li>
                  <li class="<%= typeof page !== 'undefined' && page === 'register' ? 'active' : '' %>"><a href="/register">Sign Up</a></li>
              <% } else { %>
                  <li><a href="#">Signed In As <%= currentUser.username %></a></li>
                  <li><a href="/logout">Logout</a></li>
              <% } %>
          </ul>
        </div>
    </div>
</nav>
 
 ```
 
 ## Add a posting time
  - install moment js
  - Require moment and add it to app.locals
  ```
  app.locals.moment = require('moment');
  ```
  - Update campground and comment models
  ```
     createdAt:{
      type:Date,
      default:Date.now
   },
  ```
  - Use moment in show page
  ```
<p>
    <em>Submitted by: <%= campground.author.username %>, <%= moment(campground.createdAt).fromNow() %></em>
</p>


  
  ```
 
 
 ## Add my personal info in footer
 ```
   <div class="social-icons">
    <ul class="list-inline">
      <li><a href="mailto:weichien711@gmail.com?Subject=Visiter from your website" target=_"blank"  ><i class="fa fa-envelope"></i></a></li>
      <li><a href="https://github.com/WeiChienHsu" target=_"blank"><i class="fa fa-github"></i></a></li>
      <li><a href="https://www.linkedin.com/in/weichien-hsu/" target=_"blank"><i class="fa fa-linkedin"></i></a></li>
    </ul>
  </div> <!-- /.social-icons -->
 ```
 
 ## Deploying to Heroku
    - Add a start script (app.js) in package.json
 ```
 $ heroku login
 $ heroku create
 $ git push heroku master
 
 To see the error:
 $ heroku logs
 ```
 - Used mLab to hold a mongoDB
 ```
 mongoose.connect("mongodb://weichien711:1111@ds111336.mlab.com:11336/weichienhsu");

 ```
 
 ## Create New environment (development database environment)
* Add a local DB into DATABASEURL var
```
export DATABASEURL=mongodb://localhost/yelp_camp 
```
* Now, You counld connent to your development database 
```
mongoose.connect(process.env.databaseURL);
```

* Create a backup solution
```
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

```

* Apply on Heroku, create a Config Variables
(https://yelpcamp-wei.herokuapp.com/)