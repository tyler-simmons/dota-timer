var express = require('express');
var cors = require('cors');

var router = express.Router();

router.get('/', cors(), function(req, res){
    res.sendFile('timer.JSON', {
        root: __dirname
    });
});

router.get('/test', function(req, res){
    res.sendFile('timer.JSON', {
        root: __dirname + '../data'
    });
});

module.exports = router;