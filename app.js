var express = require("express"),
	app = express();


	app.get("/", function(req,res) {
		res.send("Welcome - root route works");
	});

	app.listen(process.env.PORT, process.env.IP, function(){
		console.log("Server started");
	});