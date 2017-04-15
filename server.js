var express = require('express');
var fs = require('fs');

var app = express();

app.use(express.static('./'));

app.get('/', function(rq, rs){
    rs.sendFile('index.html');
});

app.listen(80);