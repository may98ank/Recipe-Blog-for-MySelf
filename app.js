
// Imports
var methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    bodyparser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

// setting UP different things 
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");

// setting UP DataBase

mongoose.connect("mongodb://localhost:27017/blog_data", {useNewUrlParser: true});
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});

// Making a variable to handle database operations
var Blogs = mongoose.model("Blog", blogSchema);

// Blogs.create({
//     title: "I don't know",
//     image: 'https://www.oxforduniversityimages.com/images/rotate/Image_Spring_17_4.gif',
//     body: "Hello This is a Blog Post By Mayank"
// });

app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req, res)=>{
    Blogs.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    });
});


app.get("/blogs/new", (req, res)=> {
    res.render('new');    
});

app.get("/blogs/:id", (req, res)=>{
    Blogs.findById(req.params.id, (err, blog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:blog});
        }
    });
});

app.get("/blogs/:id/edit", (req, res)=>{
    Blogs.findById(req.params.id, (err, found)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: found});
        }
    });
});


app.post("/blogs", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blogs.create(req.body.blog, (err, newBlog)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blogs.findByIdAndUpdate(req.params.id, req.body.blog, (err, updated)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", (req, res)=>{
    Blogs.findByIdAndRemove(req.params.id, (err, blog)=>{
        if(err){
            console.log("Error");
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("Starting your Blog............."); 
});