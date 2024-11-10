import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

class InteractiveBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.time = 0;
        this.mouse = new THREE.Vector2();
        this.particles = [];
        
        this.init();
    }

    init() {
        // Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.prepend(this.renderer.domElement);
        
        this.camera.position.z = 50;

        // Add post-processing
        this.setupPostProcessing();
        
        // Create elements
        this.createWavyBackground();
        this.createFloatingParticles();
        this.createTextGeometry();
        
        // Event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));

        // Start animation
        this.animate();
    }

    // Custom shader for wavy background
    get waveShader() {
        return {
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2() },
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader: `
                varying vec2 vUv;
                varying float vElevation;
                uniform float time;
                uniform vec2 mouse;

                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    
                    float elevation = sin(modelPosition.x * 3.0 + time * 2.0) * 
                                    sin(modelPosition.y * 2.0 + time * 1.5) * 0.5;
                    
                    float distanceToMouse = length(mouse - vec2(modelPosition.x, modelPosition.y));
                    elevation += (1.0 - min(distanceToMouse, 1.0)) * 2.0;
                    
                    modelPosition.z += elevation;
                    
                    vElevation = elevation;
                    
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    vec3 color1 = vec3(0.4, 0.39, 1.0); // Primary color
                    vec3 color2 = vec3(0.8, 0.3, 1.0);  // Secondary color
                    
                    float mixStrength = (vElevation + 0.5) * 0.5;
                    vec3 color = mix(color1, color2, mixStrength);
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `
        };
    }

    createWavyBackground() {
        const geometry = new THREE.PlaneGeometry(100, 100, 128, 128);
        const material = new THREE.ShaderMaterial(this.waveShader);
        this.waveMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.waveMesh);
    }

    createFloatingParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            scales[i] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                size: { value: 15 },
                texture: { value: new THREE.TextureLoader().load('particle.png') }
            },
            vertexShader: `
                attribute float scale;
                uniform float time;
                
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    float elevation = sin(position.x + time) * cos(position.y + time) * 2.0;
                    mvPosition.z += elevation;
                    
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = scale * size * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                uniform sampler2D texture;
                
                void main() {
                    vec4 texColor = texture2D(texture, gl_PointCoord);
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8) * texColor;
                }
            `,
            transparent: true,
            depthWrite: false
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.time += 0.01;

        // Update uniforms
        this.waveMesh.material.uniforms.time.value = this.time;
        this.waveMesh.material.uniforms.mouse.value = this.mouse;
        
        if (this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = this.time;
        }

        // Render
        this.composer.render();
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize
new InteractiveBackground();