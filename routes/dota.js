var express = require('express');
var cors = require('cors');

var router = express.Router();

router.get('/', cors(), function(req, res){
    res.sendFile('timer.JSON', {
        root: '../dota-timer/data'
    });
});

module.exports = router;