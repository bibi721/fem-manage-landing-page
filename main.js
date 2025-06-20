const primaryHeader = document.querySelector('.primary-header');
const navToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector(".primary-navigation");

navToggle.addEventListener('click', () => {
    const isVisible = primaryNav.hasAttribute("data-visible");
    
    if (isVisible) {
        navToggle.setAttribute("aria-expanded", false);
        primaryNav.removeAttribute("data-visible");
        primaryHeader.removeAttribute('data-overlay');
    } else {
        navToggle.setAttribute("aria-expanded", true);
        primaryNav.setAttribute("data-visible", "");
        primaryHeader.setAttribute('data-overlay', "");
    }
});

// Close navigation when clicking on overlay
primaryHeader.addEventListener('click', (e) => {
    if (primaryHeader.hasAttribute('data-overlay') && !primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute("aria-expanded", false);
        primaryNav.removeAttribute("data-visible");
        primaryHeader.removeAttribute('data-overlay');
    }
});

// Close navigation when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.hasAttribute("data-visible")) {
        navToggle.setAttribute("aria-expanded", false);
        primaryNav.removeAttribute("data-visible");
        primaryHeader.removeAttribute('data-overlay');
    }
});

// Carousel functionality - Mobile only
const carouselTrack = document.getElementById('carousel-track');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');
const slides = document.querySelectorAll('.carousel-slide');

let currentSlide = 0;
const totalSlides = slides.length;
let isAutoPlaying = true;

// Function to check if we're on mobile
function isMobile() {
    return window.innerWidth < 800; // 50em = 800px
}

// Function to update carousel position (mobile only)
function updateCarousel() {
    if (!isMobile()) return; // Don't run carousel on desktop
    
    const slideWidth = slides[0].offsetWidth;
    const offset = currentSlide * slideWidth;
    
    carouselTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update indicators
    carouselIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Add click event listeners to indicators (mobile only)
carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (!isMobile()) return;
        currentSlide = index;
        updateCarousel();
        resetAutoAdvance();
    });
});

// Auto-advance carousel every 5 seconds (mobile only)
function autoAdvance() {
    if (isAutoPlaying && isMobile()) {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
}

let autoAdvanceInterval = setInterval(autoAdvance, 5000);

// Reset auto-advance timer
function resetAutoAdvance() {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = setInterval(autoAdvance, 5000);
}

// Pause auto-advance when hovering over carousel (mobile only)
const carousel = document.querySelector('.carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        if (isMobile()) {
            isAutoPlaying = false;
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isMobile()) {
            isAutoPlaying = true;
            resetAutoAdvance();
        }
    });
}

// Handle window resize to recalculate positions and reset carousel behavior
window.addEventListener('resize', () => {
    if (isMobile()) {
        updateCarousel();
    } else {
        // Reset transform on desktop
        carouselTrack.style.transform = 'none';
        // Reset indicators
        carouselIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === 0);
        });
        currentSlide = 0;
    }
});

// Initialize carousel
updateCarousel();

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add form validation for newsletter signup
const newsletterForm = document.querySelector('.primary-footer form');
const emailInput = document.querySelector('.primary-footer input[type="email"]');

if (newsletterForm && emailInput) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showFormMessage('Please enter your email address', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate successful subscription
        showFormMessage('Thank you for subscribing!', 'success');
        emailInput.value = '';
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin-top: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        text-align: center;
        ${type === 'error' ? 
            'background-color: #fee; color: #c53030; border: 1px solid #feb2b2;' : 
            'background-color: #f0fff4; color: #2f855a; border: 1px solid #9ae6b4;'
        }
    `;
    
    newsletterForm.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}