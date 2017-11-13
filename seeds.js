var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment")

var data =[
    {
        name: "Cloud's Rest",
        image:"http://www.visitnc.com/contents/imgcrop/60726/1200/630/preview",
        description:"Bacon ipsum dolor amet beef ribs meatball tongue doner beef meatloaf. Cow pastrami shank chicken venison, bacon picanha ground round pork loin pork chop fatback. Shank jerky doner tail meatball tri-tip frankfurter pancetta cow corned beef pastrami porchetta cupim. Jerky sausage landjaeger kevin. Kevin shank chicken picanha drumstick swine brisket tail bresaola ground round. Landjaeger short loin ground round, corned beef swine bresaola venison sirloin doner.",
        author:{
            username:"Kevin"
        }    
        
    },
    {
        name: "MinTang's Camp",
        image:"http://www.visitnc.com/contents/imgcrop/61803/1200/630/preview",
        description:"Great place I've never been to. Recommented!Great place to go fishin' Bacon ipsum dolor amet kielbasa cow!!!",
        author:{
            username:"Kevin"
        }
        
    },
    {
        name: "SkyCrapper Paradas",
        image:"https://greatist.com/sites/default/files/styles/fb-1200x630/public/Campsite_featured.jpg?itok=UJly7Ji0",
        description:"Blah! Blah lah lha lha Blah!!!",
        author:{
            username:"Nick"
        }
    }
    ]

function seedDB(){
    // Remove all campgrounds
    Campground.remove({},function(err){
        if(!err){
            console.log("remove campgournds!");
            // Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err,campground){
                    if(!err){
                        console.log("add a campground");
                        // create a comment
                        Comment.create(
                            {
                                text:"This place is great!",
                                author:"Homer"
                            },function(err, comment){
                                if(!err){
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Create a new comment!");
                                }
                            }); // create Comment
                    }
                }); // create Campground
            }); // data.forEach
        }// not err
    });//remove
}

module.exports = seedDB;
// run seed