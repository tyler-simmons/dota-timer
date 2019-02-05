var express = require("express"),
	app = express();


	app.get("/", function(req,res) {
		res.send("Welcome - root route works");
	});

	app.listen(process.env.PORT, porcess.end.IP, function(){
		console.log("Server started");
	});