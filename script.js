// LUcAF Cafe Website - Interactive Functionality
// Pure Vanilla JavaScript - No Frameworks

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initVideoPlayer();
    initNavbarScrollEffect();
    initHoverEffects();
    initBookingModal();
    initParallax();
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuButton = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('nav');
    
    if (!menuButton) return;
    
    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'fixed inset-0 bg-surface z-40 transform translate-x-full transition-transform duration-500 md:hidden';
    mobileMenu.id = 'mobile-menu';
    
    const navLinks = document.querySelectorAll('.hidden.md\\:flex a');
    const ctaButton = document.querySelector('.hidden.md\\:block');
    
    let linksHTML = '';
    navLinks.forEach(link => {
        linksHTML += `<a href="${link.getAttribute('href')}" class="block text-2xl font-medium text-on-surface py-4 border-b border-outline-variant/20 hover:text-primary transition-colors">${link.textContent}</a>`;
    });
    
    mobileMenu.innerHTML = `
        <div class="flex flex-col h-full pt-24 px-8">
            <button id="close-mobile-menu" class="absolute top-6 right-8 text-primary">
                <span class="material-symbols-outlined !text-4xl">close</span>
            </button>
            <div class="space-y-2">
                ${linksHTML}
            </div>
            ${ctaButton ? `<div class="mt-8">${ctaButton.outerHTML}</div>` : ''}
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    });
    
    const closeBtn = document.getElementById('close-mobile-menu');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    }
}

// Navbar Scroll Effect
function initNavbarScrollEffect() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
            nav.classList.replace('bg-surface/80', 'bg-surface/95');
        } else {
            nav.classList.remove('shadow-lg');
            nav.classList.replace('bg-surface/95', 'bg-surface/80');
        }
    });
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        section h2, section h3, section p,
        .grid > div, .group,
        #about img, #about h2, #about p,
        #experience img, #experience h3, #experience p, #experience ul,
        #menu h2, #menu p, #menu .grid > div,
        #gallery img,
        #contact h2, #contact > div > div > div
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
    
    // Add animation styles dynamically
    addAnimationStyles();
}

function addAnimationStyles() {
    // Styles moved to HTML for better performance
}

// HTML5 Video Player with local videos
function initVideoPlayer() {
    const playBtn = document.getElementById('videoPlayBtn');
    const playButtonContainer = document.getElementById('playButtonContainer');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const mainVideo = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const videoTime = document.getElementById('videoTime');
    const videoControls = document.getElementById('videoControls');
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const videoBg = document.querySelector('.video-bg');
    
    if (!playBtn || !mainVideo) return;
    
    // Format time helper
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Open video player with animation
    playBtn.addEventListener('click', () => {
        playButtonContainer.classList.add('hidden');
        videoPlayerContainer.classList.remove('hidden');
        
        // Fade in animation
        videoPlayerContainer.style.opacity = '0';
        videoPlayerContainer.style.transform = 'scale(0.9)';
        videoPlayerContainer.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            videoPlayerContainer.style.opacity = '1';
            videoPlayerContainer.style.transform = 'scale(1)';
        }, 10);
        
        // Darken background
        if (videoBg) {
            videoBg.style.transition = 'opacity 0.5s ease';
            videoBg.style.opacity = '0.3';
        }
        
        // Auto play video
        mainVideo.play().catch(() => {});
    });
    
    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.querySelector('span').textContent = 'pause';
        } else {
            mainVideo.pause();
            playPauseBtn.querySelector('span').textContent = 'play_arrow';
        }
    });
    
    // Update progress bar
    mainVideo.addEventListener('timeupdate', () => {
        const percent = (mainVideo.currentTime / mainVideo.duration) * 100;
        progressBar.style.width = percent + '%';
        videoTime.textContent = `${formatTime(mainVideo.currentTime)} / ${formatTime(mainVideo.duration || 0)}`;
    });
    
    // Show controls on hover
    videoPlayerContainer.addEventListener('mouseenter', () => {
        videoControls.classList.remove('opacity-0');
        videoControls.classList.add('opacity-100');
    });
    
    videoPlayerContainer.addEventListener('mouseleave', () => {
        if (!mainVideo.paused) {
            videoControls.classList.remove('opacity-100');
            videoControls.classList.add('opacity-0');
        }
    });
    
    // Click video to pause/play
    mainVideo.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.querySelector('span').textContent = 'pause';
        } else {
            mainVideo.pause();
            playPauseBtn.querySelector('span').textContent = 'play_arrow';
        }
    });
    
    // Close video
    closeVideoBtn.addEventListener('click', closeVideo);
    
    function closeVideo() {
        mainVideo.pause();
        mainVideo.currentTime = 0;
        
        // Fade out animation
        videoPlayerContainer.style.opacity = '0';
        videoPlayerContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            videoPlayerContainer.classList.add('hidden');
            playButtonContainer.classList.remove('hidden');
            
            // Restore background
            if (videoBg) {
                videoBg.style.opacity = '1';
            }
        }, 300);
    }
    
    // Reset play button icon when video ends
    mainVideo.addEventListener('ended', () => {
        playPauseBtn.querySelector('span').textContent = 'play_arrow';
    });
}

// Enhanced Hover Effects
function initHoverEffects() {
    // Button hover effects with scale and shadow
    const buttons = document.querySelectorAll('a[href="#menu"], a[href="#contact"], button.bg-primary-container, button.bg-primary');
    buttons.forEach(btn => {
        btn.classList.add('transition-all', 'duration-300', 'ease-out');
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.group.bg-surface-container-low, .group.bg-surface-container-high');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Gallery image hover - add subtle zoom container
    const galleryImages = document.querySelectorAll('#gallery img');
    galleryImages.forEach(img => {
        const parent = img.parentElement;
        if (parent && !parent.classList.contains('group')) {
            parent.classList.add('overflow-hidden');
            parent.style.overflow = 'hidden';
        }
    });
    
    // Nav link underline animation
    const navLinks = document.querySelectorAll('.hidden.md\\:flex a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(173, 50, 51, 0.3)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
}

// Loading Screen (optional but adds premium feel)
function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'fixed inset-0 bg-surface z-[100] flex items-center justify-center';
    loader.innerHTML = `
        <div class="text-center">
            <h1 class="text-4xl font-serif text-primary mb-4 animate-pulse">LUcAF</h1>
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 800);
    });
}

// Parallax effect for hero (subtle)
function initParallax() {
    const hero = document.querySelector('header');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImg = hero.querySelector('img');
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Booking Modal Functionality
function initBookingModal() {
    const bookTableBtn = document.getElementById('bookTableBtn');
    const bookTableBtnMobile = document.getElementById('bookTableBtnMobile');
    const bookingModal = document.getElementById('bookingModal');
    const bookingOverlay = document.getElementById('bookingOverlay');
    const bookingContent = document.getElementById('bookingContent');
    const closeBooking = document.getElementById('closeBooking');
    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const successContent = document.getElementById('successContent');
    const closeSuccess = document.getElementById('closeSuccess');
    
    if (!bookingModal) return;
    
    function openModal() {
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            bookingContent.classList.remove('scale-95', 'opacity-0');
            bookingContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    
    if (bookTableBtn) bookTableBtn.addEventListener('click', openModal);
    if (bookTableBtnMobile) bookTableBtnMobile.addEventListener('click', openModal);
    
    // Close booking modal
    function closeModal() {
        bookingContent.classList.remove('scale-100', 'opacity-100');
        bookingContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            bookingModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
    
    if (closeBooking) closeBooking.addEventListener('click', closeModal);
    if (bookingOverlay) bookingOverlay.addEventListener('click', closeModal);
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !bookingModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Close booking modal
            closeModal();
            
            // Show success message
            setTimeout(() => {
                bookingSuccess.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    successContent.classList.remove('scale-95', 'opacity-0');
                    successContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            }, 300);
        });
    }
    
    // Close success message
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            successContent.classList.remove('scale-100', 'opacity-100');
            successContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                bookingSuccess.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        });
    }
}
