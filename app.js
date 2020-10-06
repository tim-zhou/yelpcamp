const express = require("express"),
	 app = express(),
	 bodyParser = require("body-parser"),
	 mongoose = require("mongoose"),
	  flash = require("connect-flash"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	 Campground = require("./models/campground"),
	 Comment = require("./models/comment"),
	  User = require("./models/user"),
	 seedDB = require("./seeds");

//Requiring Routes
const commentRoutes = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "very secret secret",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function(){
	console.log("Yelp Camp Server has started!");
});