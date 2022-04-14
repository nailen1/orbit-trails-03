import * as THREE from "three";

let w = window.innerWidth;
let h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 18);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const ballGeo = new THREE.IcosahedronBufferGeometry(8, 0);
const ballMat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
const mesh = new THREE.Mesh(ballGeo, ballMat);
scene.add(mesh);

const colors = [];
const color = new THREE.Color();
const numVertices = ballGeo.attributes.position.count;


const geo = new THREE.BufferGeometry();
console.log(ballGeo.attributes.position);
geo.setAttribute('position', ballGeo.attributes.position);
geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
for (let i = 0; i < numVertices; i++) {
    color.setHSL(1.0, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
}

const mat = new THREE.PointsMaterial({ size: 1.0, color: 0xFFFF00, vertexColors: false });
const points = new THREE.Points(geo, mat);
scene.add(points);

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.0075;
    mesh.rotation.y += 0.005;
    points.rotation.x += 0.0075;
    points.rotation.y += 0.005;
    renderer.render(scene, camera);
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
window.addEventListener('resize', handleWindowResize, false);