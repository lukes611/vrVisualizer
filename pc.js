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
    pcloud.rotation.x -= 90;
    return pcloud;
}

var camera;

$(document).ready(function(){
    'use strict';
    
    var size = {w : window.innerWidth, h: window.innerHeight};
    var fieldOfView = 75;
    camera = new THREE.PerspectiveCamera(75, size.w / size.h, 1, 3000);
    camera.position.z = 128;
    
    //create a box for the canvas
    var container = document.createElement('div');
    document.body.appendChild(container);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';

    var scene = new THREE.Scene();
    scene.add(toPointCloudObject(POINT_CLOUD_DATA));
   
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.w, size.h);
    container.appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        camera.lookAt(new THREE.Vector3(0,0,0));
        renderer.render(scene, camera);
    }

    animate();
});


