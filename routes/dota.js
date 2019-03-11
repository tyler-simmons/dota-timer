var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    res.sendFile('timer.JSON', {
        root: '../dota-timer/data'
    });
});

module.exports = router;