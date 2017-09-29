var bodyParser  = require("body-parser"),
express         = require("express"),
mongoose        = require("mongoose"),
app             = express();

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




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("blog app server running");
});