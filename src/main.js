import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene 설정
const scene = new THREE.Scene();

// Camera 설정
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Renderer 설정
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Raycaster 설정
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let mouseDownTime = 0;

// Earth texture 로딩
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
const bumpTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
const specularTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');

// Earth geometry 생성
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.05,
    specularMap: specularTexture,
    specular: new THREE.Color('grey'),
    shininess: 5
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 3, 5);
scene.add(pointLight);

// OrbitControls 설정
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

// 마우스 이벤트 처리
function onMouseDown(event) {
    mouseDownTime = Date.now();
    isDragging = false;
}

function onMouseMove() {
    isDragging = true;
}

function onMouseUp(event) {
    const mouseUpTime = Date.now();
    const clickDuration = mouseUpTime - mouseDownTime;

    // 드래그가 아니고 클릭 시간이 200ms 미만일 때만 클릭으로 처리
    if (!isDragging && clickDuration < 200) {
        handleClick(event);
    }
}

function handleClick(event) {
    // 마우스 좌표를 정규화된 장치 좌표로 변환
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycaster 업데이트
    raycaster.setFromCamera(mouse, camera);

    // 지구본과의 교차점 계산
    const intersects = raycaster.intersectObject(earth);

    if (intersects.length > 0) {
        // 클릭한 지점의 3D 좌표를 위도/경도로 변환
        const point = intersects[0].point.clone().normalize();
        const lat = 90 - (Math.acos(point.y) * 180 / Math.PI);
        const lon = ((270 + (Math.atan2(point.x, point.z) * 180 / Math.PI)) % 360) - 180;

        console.log(`Clicked at latitude: ${lat.toFixed(2)}, longitude: ${lon.toFixed(2)}`);

        // 한반도 지역 확인 (위도 33~43, 경도 -30~-20)
        if (lat >= 33 && lat <= 43 && lon >= -30 && lon <= -20) {
            console.log('한반도가 클릭되었습니다!');
            window.location.href = 'http://localhost:3000';
        }
    }
}

// 이벤트 리스너 등록
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);

// 창 크기 조절 이벤트 처리
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.0005;
    controls.update();
    renderer.render(scene, camera);
}

animate(); 