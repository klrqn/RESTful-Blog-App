var bodyParser  = require("body-parser");
var express     = require("express");
var app         = express();
var mongoose    = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //css

// MOMGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("there was an error: \n");
        } else { 
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // Create Blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("Error Creating New Blog Post: \n");
            res.render("new");
        } else {
            res.redirect("/");
        }
    });
});

// SHOW Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blogPost){
        if (err) {
            console.log("error: " + err);
        } else {
            res.render("show", {blogPost: blogPost});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("blog app server running");
});