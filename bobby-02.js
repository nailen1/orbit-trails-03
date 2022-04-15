import * as THREE from "three";
import { OBJLoader } from "../examples/jsm/loaders/OBJLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

function initScene(data) {
    const { geometry, matcap } = data;
    const material = new THREE.MeshMatcapMaterial({
        matcap,
        // flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const sunlight = new THREE.DirectionalLight(0xffffff);
    sunlight.position.y = 2;
    sunlight.position.z = 2;
    scene.add(sunlight);

    const bouncelight = new THREE.DirectionalLight(0xffffff, 2);
    bouncelight.position.x = 2;
    bouncelight.position.y = -2;
    bouncelight.position.z = -2;
    scene.add(bouncelight);

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const objLoader = new OBJLoader(manager);
const sceneData = {
    geometry: null,
    matcap: null
}
objLoader.load('./assets/bunny.obj', (obj) => {
    let geometry;
    obj.traverse((child) => {
        if (child.type === "Mesh") {
            geometry = child.geometry;
        }
    });
    sceneData.geometry = geometry;
});

const texLoader = new THREE.TextureLoader(manager);
texLoader.load('./assets/silver.jpg', (tex) => { sceneData.matcap = tex; });