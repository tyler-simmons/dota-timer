var express = require('express');
var cors = require('cors');

var router = express.Router();

router.get('/', cors(), function(req, res){
    res.sendFile('timer.JSON');
});

router.get('/test', function(req, res){
    res.send("Hello");
});

module.exports = router;