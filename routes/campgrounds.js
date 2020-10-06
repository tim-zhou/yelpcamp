const express= require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//Index Route
router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: campgrounds});	
		}
	});
});

//Create
router.post("/", middleware.isLoggedIn, function(req,res){
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, description: description, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//New Route
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});


//SHOW - show more info about campground
router.get("/:id", function(req,res){
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			if(!foundCampground){
					req.flash("error", "Item not found");
					return res.redirect("back");
				}
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// FIND AND UPDATE THE CORRECT CAMPGROUND
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;