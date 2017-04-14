var fs = require('fs');
var readline = require('readline');



exports.read = function(fileName, lineCb, completionCb){
    var instream = fs.createReadStream(fileName);
    var rl = readline.createInterface({
        input: instream,
        output: null,
        terminal: false
    });
    rl.on('line', lineCb);
    rl.on('close', completionCb);
};