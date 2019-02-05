var express = require("express"),
	app = express();


	app.get("/", (req,res) => {
		res.send("Welcome - root route works");
	});

	app.listen(process.env.PORT, porcess.end.IP, () => {
		console.log("Server started");
	});