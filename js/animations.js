// Animations JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    // Create observer for animation elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class when element is in viewport
                entry.target.classList.add('visible');
                
                // If we only want to play the animation once, unobserve after triggering
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove the class when element is out of viewport
                // Uncomment this if you want animations to replay each time
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.15, // Trigger when at least 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust when the animation triggers
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
        
        // Check if element has a delay attribute
        const delay = element.dataset.delay;
        if (delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
    });
    
    // Animate text elements
    const textElements = document.querySelectorAll('.hero-content h1, .hero-content p');
    
    textElements.forEach(element => {
        // Split text into individual spans for animation
        const text = element.textContent;
        let newHtml = '';
        
        // For headings, animate each word
        if (element.tagName === 'H1') {
            const words = text.split(' ');
            
            words.forEach((word, index) => {
                newHtml += `<span class="text-animate" style="transition-delay: ${index * 100}ms;">${word} </span>`;
            });
        } 
        // For paragraphs, keep as is, just add the animation class
        else {
            element.classList.add('text-animate');
        }
        
        // Only update innerHTML if we've modified the content
        if (newHtml) {
            element.innerHTML = newHtml;
        }
    });
    
    // Trigger initial animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.text-animate').forEach(element => {
            element.classList.add('visible');
        });
    }, 300);
    
    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax-effect');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            parallaxElements.forEach(element => {
                const scrollPosition = window.pageYOffset;
                const elementPosition = element.offsetTop;
                const distance = scrollPosition - elementPosition;
                
                // Only apply parallax if the element is in view
                if (distance > -window.innerHeight && distance < window.innerHeight) {
                    const parallaxFactor = 0.2; // Adjust for stronger/weaker effect
                    const yPos = distance * parallaxFactor;
                    
                    // Apply transform to the image inside the parallax container
                    const image = element.querySelector('img');
                    if (image) {
                        image.style.transform = `translateY(${yPos}px)`;
                    }
                }
            });
        });
    }
    
    // Add button animation class
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('btn-animate');
    });
    
    // Feature cards staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    const featureSection = document.querySelector('.features-grid');
    
    if (featureSection && featureCards.length > 0) {
        featureSection.classList.add('stagger-animation');
        
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animationName = 'fadeIn';
        });
    }
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });
    
    // Add a custom cursor for elevated UI experience (optional)
    const enableCustomCursor = false; // Set to true to enable
    
    if (enableCustomCursor) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            
            // Add delay to the dot for trail effect
            setTimeout(() => {
                cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }, 100);
        });
        
        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .social-icon');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('dot-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('dot-hover');
            });
        });
    }
}); 