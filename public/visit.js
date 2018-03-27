"use strict";

var isUserInteracting = false,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

//Lecture du XML de la visite
var rooms = new Map();
getXHR();



const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});

const  camera = new THREE.PerspectiveCamera(75, 1, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);

const scene = new THREE.Scene();

const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
geometry.scale(-1, 1, 1);

var texture = rooms.values().next().value;
const material = new THREE.MeshBasicMaterial({map: texture,overdraw: 0.5});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const canvas = renderer.domElement;

var text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "white";
text2.innerHTML = rooms.keys().next().value;
text2.style.top = (canvas.clientHeight - 150) + 'px';
text2.style.left =  window.innerWidth/2 + 'px';
document.body.appendChild(text2);


var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 1, 1, 1 ).normalize();
scene.add( light );

/*var geometry2 = new THREE.BoxBufferGeometry( 20, 20, 20 );

for ( var i = 0; i < 100; i ++ ) {

	var object = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

	object.position.x = Math.random() * 800 - 400;
	object.position.y = Math.random() * 800 - 400;
	object.position.z = Math.random() * 800 - 400;

	object.rotation.x = Math.random() * 2 * Math.PI;
	object.rotation.y = Math.random() * 2 * Math.PI;
	object.rotation.z = Math.random() * 2 * Math.PI;

	object.scale.x = Math.random() + 0.5;
	object.scale.y = Math.random() + 0.5;
	object.scale.z = Math.random() + 0.5;

	scene.add( object );

}*/


//Initialisation du menu
initGui();

//Enregistrement des evenements
addEventListener('mousedown',  MouseDown,      false);
addEventListener('mousemove',  MouseMove,      false);
addEventListener('mouseup',    MouseUp,        false);
addEventListener('wheel',      MouseWheel,     false);
addEventListener('resize',     Resize,     false);


function Resize()
{
	//alert("test");
	
}
function initGui()
{
    var gui = new dat.gui.GUI();
    var obj = { Room: 0 };

    gui.add(obj, 'Room', Array.from(rooms.keys())).onChange(
        function(){
			text2.innerHTML = obj.Room;
            loadImg(rooms.get(obj.Room));
        }
    );
}

//Clique de la souris enfonce
function MouseDown( event )
{
    //event.preventDefault();
    isUserInteracting = true;
    onMouseDownMouseX = event.clientX;
    onMouseDownMouseY = event.clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

//Fonction qui déplace la caméra si le clic gauche
function MouseMove( event )
{
    //Si clique de la souris enfonce
    if ( isUserInteracting === true )
    {
        // Mises a jour des valeurs de la longitude et l latitude
        lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
        lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
    }

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
}

//Fonction quand on lâche le clique desactiver le mouvement de la camera
function MouseUp( event )
{
    isUserInteracting = false;
}

//Fonction qui gere le controle molette et permet de zoomer ou dezoumer sur une image
function MouseWheel( event )
{
    /*var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp( fov, 10, 75 );
    camera.updateProjectionMatrix();*/
	
}

function loadImg(path)
{
	mesh.material.map = path;
}

function getXHR()
{
    var xmlhttp = "";
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", "http://localhost:8000/visit/" + visit.id + "/visit.xml", false);
    xmlhttp.send();
    const xmlDoc = xmlhttp.responseXML;

    var x = xmlDoc.getElementsByTagName("room");
    for (var i = 0; i < x.length; i++)
    {
        rooms.set(
            x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
			 new THREE.TextureLoader().load( "http://localhost:8000/visit/" + visit.id + "/" + x[i].getElementsByTagName("url")[0].childNodes[0].nodeValue)
        );
		
    }
}

function resizeCanvasToDisplaySize(force)
{
   
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    text2.style.top =  200 + 'px';
	text2.style.left =  (window.innerWidth/2 -40)  + 'px';

    if (force || canvas.width !== width ||canvas.height !== height)
    {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // set render target sizes here
    }
}

//Fonction qui mets a jour les valeurs de la camera
function update()
{
    //Mise a jour déplacement verticale
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    //Mets a jour l'affichage de la camera
    camera.lookAt( camera.target );
}

// fonction animate qui s'occupera d'afficher la scène
function animate()
{
    resizeCanvasToDisplaySize();
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
