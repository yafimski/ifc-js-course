import {
    Scene,
    BoxGeometry,
    EdgesGeometry,
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
    LineSegments,
    Raycaster,
    MathUtils,
    MOUSE,
    Clock,
    MeshLambertMaterial,
    LineBasicMaterial,
    DirectionalLight,
    HemisphereLight,
    AxesHelper,
    GridHelper,
} from 'three';

import {projects} from "./projects.js";
import CameraControls from 'camera-controls';
import Stats from 'three/examples/jsm/libs/stats.module';

// Custom Project data - Generated
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");
const currentProject = projects.find(project => project.id === currentProjectID);
const currentProjectLocations = currentProject.geometryLocations;
const currentProjectColor = currentProject.color;

// Scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);


// Object
const material = new MeshLambertMaterial({
    color: currentProjectColor,
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
});
const geometry = new BoxGeometry();
const edgesGeometry = new EdgesGeometry(geometry);
const edgesMaterial = new LineBasicMaterial({color: 0x000000, linewidth: 2});

const cubes = [];

for(let location of currentProjectLocations){
    const cube = new Mesh(geometry, material)
    scene.add(cube);
    
    const wireframe = new LineSegments(edgesGeometry, edgesMaterial);
    cube.add(wireframe);

    cube.position.set(location.x, location.y, location.z);
    cubes.push(cube);
}

// Camera
const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.lookAt(axes.position);
scene.add(camera);

// Renderer
const renderer = new WebGLRenderer( { canvas } );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor(0xffffff, 1);

// Lights
const light = new DirectionalLight();
const lightLocation = currentProjectLocations[0];
light.position.set(lightLocation.x, lightLocation.y, lightLocation.z).normalize();
scene.add(light);

const hemisphereLight = new HemisphereLight(0xeeeeee, 0x7075ff);
scene.add(hemisphereLight);


// Responsivity
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
});


// Controls
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

cameraControls.setLookAt(10, 12, 10, 0, 0, 0);

const stats = new Stats();
// stats.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// Animate Frames
function animate() {
    stats.begin();

    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);

    // stats.update()
    stats.end();
    
    requestAnimationFrame(animate);

    scene.remove(cubes);
    geometry.dispose();
    material.dispose();
}
animate();