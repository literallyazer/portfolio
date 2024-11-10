import * as THREE from 'three';

class ProjectCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Setup camera
        this.camera.position.z = 5;

        // Create geometry
        const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6c63ff,
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        // Add lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.onResize());
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize project canvases
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.project-canvas');
    canvases.forEach(canvas => new ProjectCanvas(canvas));
});

// Add tilt effect to project cards
VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.3,
    scale: 1.05
});