function START() {
    'use strict';
    // 'To actually be able to display anything with Three.js, we need three things:
    // A scene, a camera, and a renderer so we can render the scene with the camera.'
    // - http://threejs.org/docs/#Manual/Introduction/Creating_a_scene

    var scene, camera, renderer;

    // I guess we need this stuff too
    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;
    init();
    animate();
    var pcloud;
    
    function init() {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 3000;

        /* 	fieldOfView — Camera frustum vertical field of view.
	aspectRatio — Camera frustum aspect ratio.
	nearPlane — Camera frustum near plane.
	farPlane — Camera frustum far plane.

	- http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

	In geometry, a frustum (plural: frusta or frustums)
	is the portion of a solid (normally a cone or pyramid)
	that lies between two parallel planes cutting it. - wikipedia.		*/

        cameraZ = 128; /*	So, 1000? Yes! move on!	*/
        fogHex = 0x000000; /* As black as your heart.	*/
        fogDensity = 0.0007; /* So not terribly dense?	*/

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        container = document.createElement('div');
        //container = document.getElementById('abc');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry(); /*	NO ONE SAID ANYTHING ABOUT MATH! UGH!	*/

        particleCount = 20000; /* Leagues under the sea */

        /*	Hope you took your motion sickness pills;
	We're about to get loopy.	*/
        
        

        /*for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push(vertex);
        }*/

        /*	We can't stop here, this is bat country!	*/

        /*parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
        parameterCount = parameters.length;*/

        /*	I told you to take those motion sickness pills.
	Clean that vommit up, we're going again!	*/

        /*for (i = 0; i < parameterCount; i++) {

            color = parameters[i][0];
            size = parameters[i][1];

            materials[i] = new THREE.PointCloudMaterial({
                size: size
            });

            particles = new THREE.PointCloud(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            scene.add(particles);
        }*/
        
        
        (function(){
            var d = {points:[], colors:[]};
            luke.split(';').forEach(function(str){
                var ar = str.split(',').map(Number);
                d.points.push({x:ar[0], y:ar[1], z:ar[2]});
                d.colors.push({r:ar[3], g:ar[4], b:ar[5]});
            });
            var geo = new THREE.Geometry();
            var cols = [];
            for(var i = 0; i < d.points.length; i++)
            {
                geo.vertices.push(new THREE.Vector3(d.points[i].x-64, d.points[i].y-64, d.points[i].z-64));
                cols.push(new THREE.Color(d.colors[i].g/255, d.colors[i].g/255, d.colors[i].r/255));
            }
            geo.colors = cols;
            var mat = new THREE.PointsMaterial({
                size : 1,
                vertexColors : THREE.VertexColors
            });
            pcloud = new THREE.Points(geo, mat);
            scene.add(pcloud);
        })();

        /*	If my calculations are correct, when this baby hits 88 miles per hour...
	you're gonna see some serious shit.	*/

        renderer = new THREE.WebGLRenderer(); /*	Rendererererers particles.	*/
        renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1; unless you're fancy.	*/
        renderer.setSize(WIDTH, HEIGHT); /*	Full screen baby Wooooo!	*/

        container.appendChild(renderer.domElement); /* Let's add all this crazy junk to the page.	*/


    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        pcloud.rotation.y += .01;
        //stats.update();
    }

    function render() {
        camera.lookAt(new THREE.Vector3(0,0,0));
        renderer.render(scene, camera);
    }


};


$(document).ready(START);