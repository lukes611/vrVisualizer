function toPointCloudObject(string){
    var d = {points:[], colors:[]};
    var sum = new LV3(0,0,0);
    string.split(';').forEach(function(str){
        var ar = str.split(',').map(Number);
        var p = new LV3(ar[0], ar[1], ar[2]);
        d.points.push(p);
        d.colors.push({r:ar[3], g:ar[4], b:ar[5]});
        sum.iadd(p);
    });
    var center = sum.scale(1 / d.points.length);
    var geo = new THREE.Geometry();
    var cols = [];
    for(var i = 0; i < d.points.length; i++)
    {
        var pnt = d.points[i].sub(center);
        geo.vertices.push(new THREE.Vector3(pnt.x, pnt.y, pnt.z));
        cols.push(new THREE.Color(d.colors[i].g/255, d.colors[i].g/255, d.colors[i].r/255));
    }
    geo.colors = cols;
    var mat = new THREE.PointsMaterial({
        size : 1,
        vertexColors : THREE.VertexColors
    });
    var pcloud = new THREE.Points(geo, mat);
    //pcloud.rotation.x -= 90;
    return pcloud;
}

function generateCube(obj){
    obj = obj || {};
    obj.position = obj.position || [0,0,0];
    obj.size = obj.size || [1,1,1];
    obj.color = obj.color || 0x999999;
    obj.rotation = obj.rotation || [0,0,0];
    
    obj.rotation = obj.rotation.map(x => x / 57.3);
    
    //console.log(obj.mass, obj.mass === undefined)
    if(obj.mass === undefined) obj.mass = 1;
    //obj.mass = obj.mass!==undefined ? 1 : mass;
    var geometry = new THREE.BoxGeometry(obj.size[0],obj.size[1],obj.size[2]);
    var geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )

    var mat = new THREE.LineBasicMaterial( { color: obj.color, linewidth: 2 } );

    var cube = new THREE.LineSegments( geo, mat );
    
    
//    var material = new THREE.MeshBasicMaterial({color : obj.color, wireframe:true});
    //var cube = new THREE.Mesh(geo, material);
    cube.position.set(obj.position[0],obj.position[1],obj.position[2]);
    cube.rotation.set(obj.rotation[0],obj.rotation[1],obj.rotation[2]);
    return cube;
}

function genCam(cam){
    var at = cam.getTarget(20);
    var pos = cam.getPosition();
    
    var size = {w : window.innerWidth, h: window.innerHeight};
    var ret = new THREE.PerspectiveCamera(75, size.w / size.h, 1, 3000);
    ret.position.set(pos.x, pos.y, pos.z);
    
    ret.lookAt(new THREE.Vector3(at.x, at.y, at.z));
    
    return ret;
}



var cam = new LCamera();
var cam2 = {c: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000), at : new LV3(0,0,0)};
cam2.c.position.set(0,35, 100);
cam.position.z = 100;
cam.position.y = 35;
cam.angles.y = -90;
var type = 'kb';

function changeCamera(x){
    type = x;
    if(type == 'vr')
        $('#lkControls').hide();
    else $('#lkControls').show();
}

var lvr = new LVR();
window.addEventListener('deviceorientation', function(e){
    if(type=='vr'){
        lvr.update(e.alpha, e.beta, e.gamma);
        var pos = new LV3(cam2.c.position.x, cam2.c.position.y, cam2.c.position.z);
        var ax = lvr.getMatrix();//.transpose();
        ax = new LV3(-ax.arr[2], ax.arr[6], ax.arr[10]);
        //console.log(ax+'')
        var lat = pos.add(ax);
        cam2.at = lat.copy();
        cam2.c.lookAt(new THREE.Vector3(lat.x, lat.y, lat.z));
    }
});


$(document).ready(function(){
    'use strict';
    
    var size = {w : window.innerWidth, h: window.innerHeight};
    //create a box for the canvas
    var container = document.createElement('div');
    document.body.appendChild(container);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';

    var scene = new THREE.Scene();
    var pcob = toPointCloudObject(POINT_CLOUD_DATA);
    pcob.rotation.x = 270 / (57.3);
    pcob.position.y = 30;
    pcob.scale.set(0.25, 0.25, 0.25);
    scene.add(pcob);
    var y,x;
    var cs = 50;
    for(y = -10; y < 10; y++){
        for(x = -10; x < 10; x++){
            var cube = generateCube({position : [x*cs, -cs, y*cs], size: [cs,cs,cs], color : 'red'});
            scene.add(cube);
        }
    }
   
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.w, size.h);
    container.appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        if(type == 'kb') renderer.render(scene, genCam(cam));
        else renderer.render(scene, cam2.c);
    }

    animate();
});


