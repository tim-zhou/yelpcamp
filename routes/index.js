const express= require("express"),
	  passport = require("passport"),
	  User = require("../models/user");
const router = express.Router();

//Root Route
router.get("/", function(req, res){
	res.render("landing");
})

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelp Camp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
	res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){
	
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out")
	res.redirect("/campgrounds");
});

module.exports = router;