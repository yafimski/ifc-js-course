import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    MOUSE,
    Clock,
    MeshLambertMaterial,
    DirectionalLight,
    Color,
    MeshPhongMaterial,
    LoadingManager,
    TextureLoader
} from 'three';

import CameraControls from 'camera-controls';

// 1 The Scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 The Object
const geometry = new BoxGeometry(0.5, 0.5, 0.5);

// const loader = new TextureLoader();
// const orangeMaterial = new MeshLambertMaterial({
//     color: 0xffffff,
//     map: loader.load('./resources/ifcjs_logo.png')
// });
// const blueMaterial = new MeshBasicMaterial({color: 'blue'});

// const orangeCube = new Mesh(geometry, orangeMaterial);
// scene.add(orangeCube);

// const bigBlueCube = new Mesh(geometry, blueMaterial);
// bigBlueCube.position.x += 2;
// bigBlueCube.scale.set(2, 2, 2);
// scene.add(bigBlueCube);

const loadingManager = new LoadingManager();
const loadingElem = document.querySelector('#loading');
const progressBar = loadingElem.querySelector('.progressbar');

const images = [];
for (let i = 0; i < 6; i++) {
	images.push(`https://picsum.photos/200/300?random=${i}`);
}

const textureLoader = new TextureLoader(loadingManager);
const materials = [
	new MeshBasicMaterial({ map: textureLoader.load(images[0]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[1]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[2]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[3]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[4]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[5]) }),
];

loadingManager.onLoad = () => {
	loadingElem.style.display = 'none';
	const cube = new Mesh(geometry, materials);
	scene.add(cube);
}

loadingManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	const progress = itemsLoaded / itemsTotal;
	progressBar.style.transform = `scaleX(${progress})`;
};


// 3 The camera
const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

window.addEventListener('mousemove', (event) => {
    const position = getMousePosition(event);
    camera.position.x = Math.sin(position.x * Math.PI * 2) * 2;
    camera.position.z = Math.cos(position.x * Math.PI * 2) * 2;
    camera.position.y = position.y * 3;
    camera.lookAt(orangeCube.position);
})

function getMousePosition(event) {
    const position = new Vector2();
    const bounds = canvas.getBoundingClientRect();

    position.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
    position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;
}

// 4 The Renderer
const renderer = new WebGLRenderer( {canvas} );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

// 5 Lights
const light1 = new DirectionalLight();
light1.position.set(3, 2, 1).normalize();
scene.add(light1);

const light2 = new DirectionalLight();
light2.position.set(-3, 2, -1).normalize();
scene.add(light2);


// 6 Responsivity
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
})

// 7 Controls
const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp
    }
};
CameraControls.install( {THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;

// 8 Animation
function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
