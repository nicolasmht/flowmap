let TouchTextureClass = new TouchTexture();
let scene, camera, renderer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

var geometryPlane = new THREE.PlaneGeometry(10, 10, 125, 125);

var materialShaderPlane = new THREE.ShaderMaterial({
	uniforms: {
		time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
        uMap: { type: 't', value: TouchTextureClass.texture }
	},
	vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});

var plane = new THREE.Mesh(geometryPlane, materialShaderPlane);
plane.name = 'Plane';

var materialShaderPoints = new THREE.ShaderMaterial({
	uniforms: {
        uMap: { type: 't', value: TouchTextureClass.texture }
	},
	vertexShader: document.getElementById('vertexShaderPoints').textContent,
	fragmentShader: document.getElementById('fragmentShaderPoints').textContent
});

var points = new THREE.Points(geometryPlane, materialShaderPoints);

scene.add(plane, points);

camera.position.z = 5;

function animate() {

    TouchTextureClass.update();

	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(scene.children);

    for ( var i = 0; i < intersects.length; i++ ) {
        if (intersects[i].object.name == 'Plane') {
            TouchTextureClass.addTouch(intersects[i].uv);
            console.log('ok')
        }
	}
}

window.addEventListener('mousemove', onMouseMove, false);
animate();
