/**
 * Portfolio - Main JavaScript
 * Handles animations, interactions, and UI functionality
 */

// =====================================================
// DOM READY INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initPortfolioFilters();
    initSmoothScroll();
    initContactForm();
    initParallaxEffects();
    initTypewriter();
});

// =====================================================
// NAVBAR FUNCTIONALITY
// =====================================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll behavior for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show on scroll direction (optional - uncomment to enable)
        // if (currentScroll > lastScroll && currentScroll > 100) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle?.classList.remove('active');
            navLinks?.classList.remove('mobile-open');
            document.body.classList.remove('menu-open');
        });
    });
}

// =====================================================
// SCROLL ANIMATIONS (Intersection Observer)
// =====================================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Also add animation classes to sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
            observer.observe(section);
        }
    });
}

// =====================================================
// PORTFOLIO FILTERS
// =====================================================
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter items with animation
            portfolioItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                } else {
                    item.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add filter animations to stylesheet dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// CONTACT FORM
// =====================================================
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="60">
                    <animate attributeName="stroke-dashoffset" values="60;0" dur="0.5s" fill="freeze"/>
                    <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
            Sending...
        `;
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success state
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            Message Sent!
        `;
        submitBtn.style.background = '#10b981';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
    
    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// =====================================================
// PARALLAX EFFECTS
// =====================================================
function initParallaxEffects() {
    const bgGlows = document.querySelectorAll('.bg-glow');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        bgGlows.forEach((glow, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            glow.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

// =====================================================
// TYPEWRITER EFFECT (Optional - for hero section)
// =====================================================
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    
    if (!typewriterElement) return;
    
    const words = ['Designer', 'Developer', 'Creator', 'Innovator'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// =====================================================
// COUNTER ANIMATION (For stats)
// =====================================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target) || parseInt(counter.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function for performance
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add loaded class to body when page is fully loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
