// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
const cursor = {
    outer: document.querySelector('.cursor-outer'),
    inner: document.querySelector('.cursor-inner')
};

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Smooth cursor movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.outer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursor.inner.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    
    requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-bubble');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.outer.classList.add('cursor-hover');
        cursor.inner.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.outer.classList.remove('cursor-hover');
        cursor.inner.classList.remove('cursor-hover');
    });
});

// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

themeToggle.addEventListener('click', () => {
    themeToggle.classList.toggle('active');
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
        root.style.setProperty('--background', '#f0f0f0');
        root.style.setProperty('--text-color', '#0a0a0a');
    } else {
        root.style.setProperty('--background', '#0a0a0a');
        root.style.setProperty('--text-color', '#ffffff');
    }
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const texts = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start typing animation
setTimeout(type, 1000);

// Hero section animations
gsap.from('.text-top', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
});

gsap.from('.glitch', {
    scale: 0,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "elastic.out(1, 0.3)"
});

gsap.from('.cta-buttons', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Scroll animations
gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        ease: "power3.out"
    });
});

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    gsap.to('.hero-content', {
        duration: 1,
        x: mouseX * 50,
        y: mouseY * 50,
        ease: "power2.out"
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: target,
                offsetY: 70
            },
            ease: "power3.inOut"
        });
    });
});