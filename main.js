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

// Carousel functionality
const carouselTrack = document.getElementById('carousel-track');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');
const slides = document.querySelectorAll('.carousel-slide');

let currentSlide = 0;
const totalSlides = slides.length;

// Function to update carousel position
function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    const gap = 24; // 1.5rem gap converted to pixels
    const offset = currentSlide * (slideWidth + gap);
    
    carouselTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update indicators
    carouselIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Add click event listeners to indicators
carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Auto-advance carousel every 5 seconds
function autoAdvance() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

let autoAdvanceInterval = setInterval(autoAdvance, 5000);

// Pause auto-advance when user interacts with indicators
carouselIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(autoAdvance, 5000);
    });
});

// Handle window resize to recalculate positions
window.addEventListener('resize', updateCarousel);

// Initialize carousel
updateCarousel();