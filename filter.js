
function Volout(min, max, len, largestDimensions, res){
    this.min = min;
    this.max = max;
    this.len = len;
    this.ld = largestDimensions;
    this.ar = new Array(res*res*res);
    this.res = res;
    this.ressq = res * res;
    for(var i = 0; i < this.ar.length; i++) this.ar[i] = [0,0,0,0];
}

Volout.prototype.push = function(x,y,z, r,g,b){
    x -= this.min[0];
    y -= this.min[1];
    z -= this.min[2];
    
    x *= this.res / this.len[0];
    y *= this.res / this.len[1];
    z *= this.res / this.len[2];
    
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);
    
    if(x < 0 || x >= this.res || y < 0 || y >= this.res || z < 0 || z >= this.res) return;
    
    var index = z * this.ressq + y * this.res + x;
    
    var c = this.ar[index][3];
    var scalar = c / (c+1);
    var scalar2 = 1 / (c+1);
    this.ar[index][0] = r * scalar + this.ar[index][0] * scalar2;
    this.ar[index][1] = g * scalar + this.ar[index][1] * scalar2;
    this.ar[index][2] = b * scalar + this.ar[index][2] * scalar2;
    
    this.ar[index][3]++;
    
};

Volout.prototype.write = function(fileName){
    var fs = require('fs');
    var out = fs.createWriteStream(fileName);
    var x,y,z;
    var has = false;
    for(z=0;z<this.res;z++){
        for(y=0;y<this.res;y++){
            for(x=0;x<this.res;x++){
                var index = z * this.ressq + y * this.res + x;
                var a = this.ar[index];
                if(a[3] > 0){
                    if(has) out.write(';');
                    var tmp = [x,y,z].concat(a.slice(0,3)).map(Math.floor.bind(Math));
                    out.write(tmp.join(','));
                    has= true;
                }
                
            }
        }
    }
    out.end();
};



function stats(fileName, cb){
    var LLine = require('./LLine.js');
    var min = [Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
    var max = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY];
    
    LLine.read(fileName, function(line){
        var nums = line.split(' ').map(Number);
        if(nums.length != 6) return;
        for(var i = 0; i < 3; i++){
            if(nums[i] > max[i]) max[i] = nums[i];
            if(nums[i] < min[i]) min[i] = nums[i];
        }
        
        
    }, function(){
        var lengths = min.map((m, i) => max[i] - m);
        var ret = {
            min:min, max:max,
            len : lengths,
            largestDimension : Math.max.apply(Math, lengths)
        };
        cb(ret);
    });
}

var readFileName = 'myOutput.txt';

stats(readFileName, function(d){
    console.log('stats', d);
    var v = new Volout(d.min, d.max, d.len, d.largestDimension, 128);
    require('./LLine.js').read(readFileName, function(line){
        var nums = line.split(' ').map(Number);
        v.push(nums[0],nums[1],nums[2],nums[3],nums[4],nums[5]);
    }, function(){
        console.log('writing output');
        v.write('pc.txt');
    });
});