import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

class ProjectShowcase {
    constructor() {
        this.container = document.querySelector('#project-showcase');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.devices = [];
        this.currentProject = 0;
        this.isAnimating = false;

        this.projects = [
            {
                name: "Project 1",
                deviceType: "laptop",
                screenshot: "path/to/screenshot1.jpg",
                position: new THREE.Vector3(0, 0, 0),
                rotation: new THREE.Euler(0, Math.PI * 0.1, 0)
            },
            {
                name: "Project 2",
                deviceType: "phone",
                screenshot: "path/to/screenshot2.jpg",
                position: new THREE.Vector3(2, 0, -1),
                rotation: new THREE.Euler(0, -Math.PI * 0.1, 0)
            },
            // Add more projects as needed
        ];

        this.init();
    }

    async init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 1, 5);

        // Setup lights
        this.setupLights();

        // Load models
        await this.loadModels();

        // Add event listeners
        this.addEventListeners();

        // Start animation
        this.animate();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0x6c63ff, 0.5);
        rimLight.position.set(-5, 5, -5);
        this.scene.add(rimLight);
    }

    async loadModels() {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        for (const project of this.projects) {
            try {
                const model = await this.loadModel(loader, project.deviceType);
                const device = model.scene.clone();
                
                // Setup device
                device.position.copy(project.position);
                device.rotation.copy(project.rotation);
                device.scale.set(0.5, 0.5, 0.5);

                // Add screenshot texture
                await this.addScreenTexture(device, project.screenshot);

                this.devices.push(device);
                this.scene.add(device);

                // Initial animation
                device.scale.set(0, 0, 0);
                this.animateDeviceIn(device);
            } catch (error) {
                console.error(`Error loading model for ${project.name}:`, error);
            }
        }
    }

    async loadModel(loader, type) {
        const modelPath = type === 'laptop' ? 'models/laptop.glb' : 'models/phone.glb';
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (gltf) => resolve(gltf),
                undefined,
                (error) => reject(error)
            );
        });
    }

    async addScreenTexture(device, screenshotPath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = await new Promise((resolve) => {
            textureLoader.load(screenshotPath, (texture) => resolve(texture));
        });

        device.traverse((child) => {
            if (child.name === 'screen') {
                child.material = new THREE.MeshBasicMaterial({
                    map: texture,
                    emissive: 0xffffff,
                    emissiveMap: texture,
                    emissiveIntensity: 0.2
                });
            }
        });
    }

    animateDeviceIn(device) {
        gsap.to(device.scale, {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            duration: 1.5,
            ease: "elastic.out(1, 0.75)"
        });

        gsap.to(device.rotation, {
            y: device.rotation.y + Math.PI * 2,
            duration: 2,
            ease: "power2.out"
        });
    }

    switchProject(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const nextProject = (this.currentProject + direction + this.devices.length) % this.devices.length;
        const currentDevice = this.devices[this.currentProject];
        const nextDevice = this.devices[nextProject];

        // Animate current device out
        gsap.to(currentDevice.position, {
            x: currentDevice.position.x - direction * 2,
            z: currentDevice.position.z - 2,
            duration: 1,
            ease: "power2.inOut"
        });

        gsap.to(currentDevice.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: "power2.inOut"
        });

        // Animate next device in
        gsap.fromTo(nextDevice.position,
            {
                x: nextDevice.position.x + direction * 2,
                z: nextDevice.position.z - 2
            },
            {
                x: nextDevice.position.x,
                z: nextDevice.position.z,
                duration: 1,
                ease: "power2.inOut"
            }
        );

        gsap.fromTo(nextDevice.scale,
            { x: 0, y: 0, z: 0 },
            {
                x: 0.5,
                y: 0.5,
                z: 0.5,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    this.isAnimating = false;
                }
            }
        );

        this.currentProject = nextProject;
    }

    addEventListeners() {
        // Arrow keys for navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.switchProject(-1);
            if (e.key === 'ArrowRight') this.switchProject(1);
        });

        // Mouse wheel navigation
        this.container.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) this.switchProject(1);
            if (e.deltaY < 0) this.switchProject(-1);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Gentle floating animation
        this.devices.forEach(device => {
            device.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
new ProjectShowcase();