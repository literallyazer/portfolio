document.addEventListener('DOMContentLoaded', () => {
    // Initialize skill categories animation
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                initializeSkillLevels(entry.target);
            }
        });
    }, observerOptions);

    skillCategories.forEach(category => {
        skillObserver.observe(category);
    });

    // Initialize skill level animations
    function initializeSkillLevels(category) {
        const skillBubbles = category.querySelectorAll('.skill-bubble');
        
        skillBubbles.forEach((bubble, index) => {
            setTimeout(() => {
                bubble.classList.add('animate');
                const level = bubble.dataset.level;
                bubble.style.setProperty('--skill-level', `${level}%`);
                
                // Animate the number counting up
                const levelSpan = bubble.querySelector('.skill-level');
                animateNumber(0, parseInt(level), 1500, levelSpan);
            }, index * 200);
        });
    }

    // Number animation function
    function animateNumber(start, end, duration, element) {
        const range = end - start;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(progress * range + start);
            element.textContent = `${value}%`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Add hover effects to skill bubbles
    const skillBubbles = document.querySelectorAll('.skill-bubble');
    
    skillBubbles.forEach(bubble => {
        bubble.addEventListener('mouseenter', () => {
            gsap.to(bubble, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out",
                backgroundColor: 'rgba(108, 99, 255, 0.2)'
            });
        });

        bubble.addEventListener('mouseleave', () => {
            gsap.to(bubble, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                backgroundColor: 'rgba(108, 99, 255, 0.1)'
            });
        });
    });

    // Create floating particles
    function createParticles() {
        const particlesContainer = document.querySelector('.skills-particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);

            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
            });

            animateParticle(particle);
        }
    }

    function animateParticle(particle) {
        gsap.to(particle, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            duration: Math.random() * 10 + 5,
            ease: "none",
            onComplete: () => animateParticle(particle)
        });
    }

    // Initialize particles
    createParticles();
});