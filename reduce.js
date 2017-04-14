var fs = require('fs');
var LLine = require('./LLine.js');

var out = fs.createWriteStream('myOutput.txt');

LLine.read('multi_selection.csv', function(data){
    if(data[0] != '#') out.write(data.split(',').map(Number).join(' ') + '\n');
}, function(){
    out.end();
});
