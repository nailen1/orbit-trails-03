import * as THREE from "three";
import { GUI } from 'lil-gui.module.min';
import { OrbitControls } from "OrbitControls.js";
import { EffectComposer } from "EffectComposer.js";
import { RenderPass } from "RenderPass.js";
import { UnrealBloomPass } from "UnrealBloomPass.js";
import { AfterimagePass } from "AfterimagePass.js";


const params = {
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0
};

let w = window.innerWidth;
let h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 18);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 3, 0, 0);
composer.addPass(bloomPass);
const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.95;
composer.addPass(afterImagePass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const ballGeo = new THREE.IcosahedronBufferGeometry(8, 10);
// const ballMat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
// const mesh = new THREE.Mesh(ballGeo, ballMat);
// scene.add(mesh);

const colors = [];
const color = new THREE.Color();
const numVertices = ballGeo.attributes.position.count;
let y;
for (let i = 0; i < numVertices; i++) {
    y = ballGeo.attributes.position.array[i * 3 + 1];
    color.setHSL(0.2 + y * 0.025, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', ballGeo.attributes.position);
geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({ size: 0.25, color: 0xFFFF00, vertexColors: true });
const points = new THREE.Points(geo, mat);
scene.add(points);

function animate() {
    requestAnimationFrame(animate);
    // mesh.rotation.x += 0.0075;
    // mesh.rotation.y += 0.005;
    points.rotation.x += 0.010;
    points.rotation.y += 0.005;
    composer.render(scene, camera);
}
animate();

function handleWindowResize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(w, h);

}

const gui = new GUI();

gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function(value) {

    bloomPass.threshold = Number(value);

});

gui.add(params, 'bloomStrength', 0.0, 20.0).onChange(function(value) {

    bloomPass.strength = Number(value);

});

gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function(value) {

    bloomPass.radius = Number(value);

});
window.addEventListener('resize', handleWindowResize, false);