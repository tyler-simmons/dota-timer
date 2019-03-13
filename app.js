var express = require("express"),
		app = express();
var cors = require('cors');
const os = require('os');
var port = process.env.PORT || 3000;

var dotaRoutes = require('./routes/dota');

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
	
app.get("/", function(req, res){
	res.sendFile("index.html");
});

app.use('/api', dotaRoutes);
	
app.listen(port, process.env.IP, function(){
	console.log("Server started successfully");
	//local network info
	var networkDevice = os.networkInterfaces();
	var addr = networkDevice['en0'][1].address;
	console.log(`Server listening on ${addr}:3000`);
});	