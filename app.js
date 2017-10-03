var bodyParser  = require("body-parser");
var express     = require("express");
var app         = express();
var mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //css
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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
        req.body.blog.body = req.sanitizer(req.body.blog.body);
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

// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, editPost){
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", {editPost, editPost});
        }
    });
});

// UPDATE Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE Route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("blog app server running");
});