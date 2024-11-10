import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class SkillsGraph {
    constructor() {
        this.container = document.querySelector('.skills-graph-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.nodes = [];
        this.connections = [];
        this.skills = [
            { name: 'JavaScript', level: 90, group: 'frontend' },
            { name: 'React', level: 85, group: 'frontend' },
            { name: 'Node.js', level: 88, group: 'backend' },
            { name: 'Python', level: 82, group: 'backend' },
            { name: 'Three.js', level: 75, group: 'frontend' },
            { name: 'MongoDB', level: 80, group: 'backend' }
        ];

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 30;
        this.camera.position.y = 10;

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;

        // Create nodes
        this.createNodes();
        
        // Create connections
        this.createConnections();

        // Add lights
        this.addLights();

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Handle mouse movement
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    createNodes() {
        this.skills.forEach((skill, index) => {
            const geometry = new THREE.IcosahedronGeometry(skill.level / 20, 0);
            const material = new THREE.MeshPhongMaterial({
                color: 0x6c63ff,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });

            const node = new THREE.Mesh(geometry, material);
            
            // Position nodes in a circular pattern
            const angle = (index / this.skills.length) * Math.PI * 2;
            const radius = 15;
            node.position.x = Math.cos(angle) * radius;
            node.position.y = Math.sin(angle) * radius;
            node.position.z = Math.random() * 10 - 5;

            this.scene.add(node);
            this.nodes.push(node);

            // Add text label
            const textGeometry = new THREE.TextGeometry(skill.name, {
                font: new THREE.Font(), // You'll need to load a font
                size: 0.5,
                height: 0.1
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(node.position);
            textMesh.position.y += 2;
            this.scene.add(textMesh);
        });
    }

    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.5) continue;

                const geometry = new THREE.BufferGeometry().setFromPoints([
                    this.nodes[i].position,
                    this.nodes[j].position
                ]);
                const material = new THREE.LineBasicMaterial({ 
                    color: 0x6c63ff,
                    transparent: true,
                    opacity: 0.2
                });
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.connections.push(line);
            }
        }
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        this.nodes.forEach(node => {
            gsap.to(node.rotation, {
                x: mouseY * 0.5,
                y: mouseX * 0.5,
                duration: 1
            });
        });
    }

    onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Update controls
        this.controls.update();

        // Animate nodes
        this.nodes.forEach(node => {
            node.rotation.x += 0.005;
            node.rotation.y += 0.005;
        });

        // Update connections
        this.connections.forEach(line => {
            line.geometry.verticesNeedUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsGraph();
});import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class SkillsGraph {
    constructor() {
        this.container = document.querySelector('.skills-graph-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.nodes = [];
        this.connections = [];
        this.skills = [
            { name: 'JavaScript', level: 90, group: 'frontend' },
            { name: 'React', level: 85, group: 'frontend' },
            { name: 'Node.js', level: 88, group: 'backend' },
            { name: 'Python', level: 82, group: 'backend' },
            { name: 'Three.js', level: 75, group: 'frontend' },
            { name: 'MongoDB', level: 80, group: 'backend' }
        ];

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 30;
        this.camera.position.y = 10;

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;

        // Create nodes
        this.createNodes();
        
        // Create connections
        this.createConnections();

        // Add lights
        this.addLights();

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Handle mouse movement
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    createNodes() {
        this.skills.forEach((skill, index) => {
            const geometry = new THREE.IcosahedronGeometry(skill.level / 20, 0);
            const material = new THREE.MeshPhongMaterial({
                color: 0x6c63ff,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });

            const node = new THREE.Mesh(geometry, material);
            
            // Position nodes in a circular pattern
            const angle = (index / this.skills.length) * Math.PI * 2;
            const radius = 15;
            node.position.x = Math.cos(angle) * radius;
            node.position.y = Math.sin(angle) * radius;
            node.position.z = Math.random() * 10 - 5;

            this.scene.add(node);
            this.nodes.push(node);

            // Add text label
            const textGeometry = new THREE.TextGeometry(skill.name, {
                font: new THREE.Font(), // You'll need to load a font
                size: 0.5,
                height: 0.1
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(node.position);
            textMesh.position.y += 2;
            this.scene.add(textMesh);
        });
    }

    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.5) continue;

                const geometry = new THREE.BufferGeometry().setFromPoints([
                    this.nodes[i].position,
                    this.nodes[j].position
                ]);
                const material = new THREE.LineBasicMaterial({ 
                    color: 0x6c63ff,
                    transparent: true,
                    opacity: 0.2
                });
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.connections.push(line);
            }
        }
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        this.nodes.forEach(node => {
            gsap.to(node.rotation, {
                x: mouseY * 0.5,
                y: mouseX * 0.5,
                duration: 1
            });
        });
    }

    onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Update controls
        this.controls.update();

        // Animate nodes
        this.nodes.forEach(node => {
            node.rotation.x += 0.005;
            node.rotation.y += 0.005;
        });

        // Update connections
        this.connections.forEach(line => {
            line.geometry.verticesNeedUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsGraph();
});