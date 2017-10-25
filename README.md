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
* Add description to my campground model
* Show db.collection.drop()
* Add a show route/template