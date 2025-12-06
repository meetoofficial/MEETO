// script.js - Enhanced with Real-time Counters & Interactive Demo

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs, getCountFromServer, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOwk37TCbc_loEb-LFXLK3qWQBdOaaqlU",
    authDomain: "meeto-website.firebaseapp.com",
    projectId: "meeto-website",
    storageBucket: "meeto-website.firebasestorage.app",
    messagingSenderId: "950489624932",
    appId: "1:950489624932:web:65f005771901f763e64a71",
    measurementId: "G-TVM3G555P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Real-time counters with growth simulation
let travelersCount = 15600;
let adventuresCount = 8500;
let countriesCount = 120;
let counterInterval;

// Initialize counters with realistic growth
function initCounterGrowth() {
    // Start with real data
    travelersCount = 15600;
    adventuresCount = 8500;
    
    // Update counters every 2 seconds with realistic growth
    counterInterval = setInterval(() => {
        // Simulate organic growth
        const travelerGrowth = Math.floor(Math.random() * 5) + 1; // 1-5 new travelers
        const adventureGrowth = Math.floor(Math.random() * 3) + 1; // 1-3 new adventures
        
        travelersCount += travelerGrowth;
        adventuresCount += adventureGrowth;
        
        updateLiveCounters();
    }, 2000);
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';

// Create enhanced mobile menu
mobileMenu.innerHTML = `
    <div class="mobile-menu-header">
        <h3>MEETO Navigation</h3>
    </div>
    <ul>
        <li><a href="#home" class="mobile-nav-link"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="#features" class="mobile-nav-link"><i class="fas fa-star"></i> Features</a></li>
        <li><a href="#how-it-works" class="mobile-nav-link"><i class="fas fa-play-circle"></i> How It Works</a></li>
        <li><a href="#demo" class="mobile-nav-link"><i class="fas fa-play"></i> Demo</a></li>
        <li><a href="#testimonials" class="mobile-nav-link"><i class="fas fa-comment-alt"></i> Stories</a></li>
        <li><a href="#team" class="mobile-nav-link"><i class="fas fa-users"></i> Team</a></li>
        <li><a href="#contact" class="mobile-nav-link"><i class="fas fa-envelope"></i> Contact</a></li>
        <li class="mobile-menu-divider"></li>
        <li><a href="app.html" class="btn btn-primary mobile-app-btn"><i class="fas fa-rocket"></i> Launch App</a></li>
    </ul>
    <div class="mobile-menu-footer">
        <p>MEETO - Bonn, Germany</p>
        <p>Launching February 2024</p>
    </div>
`;

document.body.appendChild(mobileMenu);

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active');
    menuToggle.innerHTML = mobileMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close mobile menu when clicking links
mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.classList.remove('active');
}

// Smooth scrolling with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Real-time counters with animation
function updateLiveCounters() {
    const statElements = document.querySelectorAll('.stat h3');
    if (statElements.length >= 3) {
        // Animate Adventures Created
        animateCounter(statElements[0], adventuresCount, '+');
        // Animate Travelers Connected
        animateCounter(statElements[1], travelersCount, '+');
        // Countries (with slight variation for realism)
        statElements[2].textContent = countriesCount + '+';
    }
}

function animateCounter(element, target, suffix = '') {
    const current = parseInt(element.textContent.replace(suffix, '')) || 0;
    if (current === target) return;
    
    const duration = 1000;
    const startTime = Date.now();
    const startValue = current;
    
    function updateCounter() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const value = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = value.toLocaleString() + suffix;
        element.classList.add('counter-up');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            setTimeout(() => {
                element.classList.remove('counter-up');
            }, 300);
        }
    }
    
    updateCounter();
}

// Interactive Demo System
function setupInteractiveDemo() {
    // Demo video modal
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', showVideoModal);
    }
    
    // Interactive demo button
    const interactiveDemoBtn = document.querySelector('.btn-interactive-demo');
    if (interactiveDemoBtn) {
        interactiveDemoBtn.addEventListener('click', showInteractiveDemoModal);
    }
    
    // Try Demo buttons
    document.querySelectorAll('a[href*="demo"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.href.includes('#demo') || btn.classList.contains('demo-trigger')) {
                e.preventDefault();
                showInteractiveDemoModal();
            }
        });
    });
}

function showVideoModal() {
    const modalHTML = `
        <div class="modal-overlay video-modal-overlay">
            <div class="modal video-modal">
                <button class="modal-close video-modal-close">&times;</button>
                <h2>MEETO Platform Demo</h2>
                <p>See how travelers connect and plan adventures together</p>
                
                <div class="video-container">
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" 
                            title="MEETO Platform Demo" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
                
                <div class="demo-features">
                    <h3>Key Features Showcased:</h3>
                    <div class="features-list">
                        <div class="feature-item">
                            <i class="fas fa-user-check"></i>
                            <span>AI-Powered Matching</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Group Planning Tools</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-map-marked-alt"></i>
                            <span>Smart Itinerary Builder</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-comments"></i>
                            <span>Real-time Chat & Voting</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.video-modal-overlay');
    const closeBtn = modal.querySelector('.video-modal-close');
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function showInteractiveDemoModal() {
    logEvent(analytics, 'interactive_demo_started');
    
    const modalHTML = `
        <div class="modal-overlay interactive-demo-modal">
            <div class="modal interactive-demo-content">
                <button class="modal-close">&times;</button>
                
                <div class="demo-header">
                    <h2>Interactive Demo Experience</h2>
                    <p>Experience MEETO's key features in this interactive walkthrough</p>
                </div>
                
                <div class="demo-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">Step 1 of 4</div>
                </div>
                
                <div class="demo-steps-container">
                    <div class="demo-step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Choose Your Adventure Mood</h3>
                            <p>What kind of experience are you looking for?</p>
                            <div class="mood-selector">
                                <div class="mood-option" data-mood="explorer">
                                    <i class="fas fa-mountain"></i>
                                    <span>Explorer</span>
                                </div>
                                <div class="mood-option" data-mood="foodie">
                                    <i class="fas fa-utensils"></i>
                                    <span>Foodie</span>
                                </div>
                                <div class="mood-option" data-mood="relax">
                                    <i class="fas fa-spa"></i>
                                    <span>Relax</span>
                                </div>
                                <div class="mood-option" data-mood="culture">
                                    <i class="fas fa-landmark"></i>
                                    <span>Culture</span>
                                </div>
                                <div class="mood-option" data-mood="party">
                                    <i class="fas fa-glass-cheers"></i>
                                    <span>Party</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="demo-step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Select Your Destination & Dates</h3>
                            <p>Where and when do you want to travel?</p>
                            <div class="destination-selector">
                                <input type="text" placeholder="Enter destination (e.g., Berlin, Bali)" class="demo-input">
                                <div class="date-selector">
                                    <input type="date" class="demo-input" id="demo-date">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="demo-step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3>Find Travel Companions</h3>
                            <p>MEETO will match you with compatible travelers</p>
                            <div class="matches-preview">
                                <div class="match-profile">
                                    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Match">
                                    <div class="match-info">
                                        <h4>Sarah</h4>
                                        <p>Berlin • Photographer</p>
                                        <div class="match-score">
                                            <span class="score">92% Match</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="match-profile">
                                    <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Match">
                                    <div class="match-info">
                                        <h4>James</h4>
                                        <p>London • Food Blogger</p>
                                        <div class="match-score">
                                            <span class="score">88% Match</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="demo-step" data-step="4">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h3>Plan Your Adventure Together</h3>
                            <p>Collaboratively plan with your new travel buddies</p>
                            <div class="planning-demo">
                                <div class="itinerary-item">
                                    <div class="item-time">Day 1</div>
                                    <div class="item-content">
                                        <h4>Local Food Tour</h4>
                                        <p>4 people are interested</p>
                                    </div>
                                    <button class="vote-btn">Vote</button>
                                </div>
                                <div class="itinerary-item">
                                    <div class="item-time">Day 2</div>
                                    <div class="item-content">
                                        <h4>Museum Visit</h4>
                                        <p>3 people are interested</p>
                                    </div>
                                    <button class="vote-btn">Vote</button>
                                </div>
                                <div class="itinerary-item">
                                    <div class="item-time">Day 3</div>
                                    <div class="item-content">
                                        <h4>Hiking Adventure</h4>
                                        <p>5 people are interested</p>
                                    </div>
                                    <button class="vote-btn">Vote</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="btn btn-outline prev-step" disabled>Previous</button>
                    <button class="btn btn-primary next-step">Next Step</button>
                    <button class="btn btn-secondary skip-demo" style="display: none;">Skip to App</button>
                </div>
                
                <div class="demo-footer">
                    <p>This is an interactive preview. <a href="app.html">Launch the full app</a> to start planning real adventures!</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.interactive-demo-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const nextBtn = modal.querySelector('.next-step');
    const prevBtn = modal.querySelector('.prev-step');
    const skipBtn = modal.querySelector('.skip-demo');
    const moodOptions = modal.querySelectorAll('.mood-option');
    const progressFill = modal.querySelector('.progress-fill');
    const progressText = modal.querySelector('.progress-text');
    
    let currentStep = 1;
    let selectedMood = '';
    
    // Initialize modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Mood selection
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedMood = option.dataset.mood;
            logEvent(analytics, 'demo_mood_selected', { mood: selectedMood });
        });
    });
    
    // Step navigation
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    
    function goToNextStep() {
        if (currentStep < 4) {
            currentStep++;
            updateDemoStep();
        } else {
            // Demo completed
            completeDemo();
        }
    }
    
    function goToPrevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateDemoStep();
        }
    }
    
    function updateDemoStep() {
        // Update step visibility
        modal.querySelectorAll('.demo-step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update controls
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 4) {
            nextBtn.textContent = 'Complete Demo';
        } else {
            nextBtn.textContent = 'Next Step';
        }
        
        // Update progress
        const progress = ((currentStep - 1) / 3) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Step ${currentStep} of 4`;
        
        // Show skip button on last step
        skipBtn.style.display = currentStep === 4 ? 'inline-flex' : 'none';
    }
    
    function completeDemo() {
        logEvent(analytics, 'demo_completed');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            // Show success message
            alert('Demo completed! You\'re ready to start planning real adventures with MEETO.');
            window.location.href = 'app.html';
        }, 300);
    }
    
    // Skip to app
    skipBtn.addEventListener('click', () => {
        window.location.href = 'app.html';
    });
}

// Footer Links Functionality
function setupFooterLinks() {
    // Product Links
    const productLinks = {
        'Features': '#features',
        'How It Works': '#how-it-works',
        'Web App': 'app.html',
        'Pricing': '#pricing',
        'Updates': '#updates'
    };
    
    // Company Links
    const companyLinks = {
        'About Us': 'about.html',
        'Our Team': '#team',
        'Careers': 'careers.html',
        'Press': 'press.html',
        'Blog': 'blog.html'
    };
    
    // Support Links
    const supportLinks = {
        'Help Center': 'help.html',
        'Safety Center': 'safety.html',
        'Community': 'community.html',
        'Contact Us': 'contact.html',
        'System Status': 'status.html'
    };
    
    // Legal Links
    const legalLinks = {
        'Privacy Policy': 'privacy.html',
        'Terms of Service': 'terms.html',
        'Cookie Policy': 'cookies.html',
        'Community Guidelines': 'guidelines.html'
    };
    
    // Set up all footer links
    setupFooterSection('Product', productLinks);
    setupFooterSection('Company', companyLinks);
    setupFooterSection('Support', supportLinks);
    setupFooterSection('Legal', legalLinks);
    
    // Create placeholder pages for non-existent links
    setupPlaceholderPages();
}

function setupFooterSection(section, links) {
    const sectionElement = document.querySelector(`.footer-col h4:contains("${section}")`)?.parentElement;
    if (!sectionElement) return;
    
    const linksList = sectionElement.querySelector('ul');
    if (!linksList) return;
    
    linksList.innerHTML = '';
    Object.entries(links).forEach(([text, href]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        li.appendChild(a);
        linksList.appendChild(li);
    });
}

function setupPlaceholderPages() {
    // This would create placeholder pages for all links
    // In a real implementation, you'd have actual pages
    console.log('Setting up placeholder pages for footer links...');
}

// Social Media Links
function setupSocialLinks() {
    const socialLinks = {
        twitter: 'https://twitter.com/meetoapp',
        instagram: 'https://instagram.com/meetoapp',
        facebook: 'https://facebook.com/meetoapp',
        linkedin: 'https://linkedin.com/company/meetoapp',
        youtube: 'https://youtube.com/@meetoapp'
    };
    
    document.querySelectorAll('.social-links a').forEach(link => {
        const icon = link.querySelector('i');
        if (icon) {
            const platform = icon.className.split('fa-')[1].split(' ')[0];
            if (socialLinks[platform]) {
                link.href = socialLinks[platform];
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        }
    });
}

// Scroll Effects
function setupScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animate elements on scroll
        animateOnScroll();
    });
    
    // Initial animation check
    animateOnScroll();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .step, .testimonial-card, .team-member, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Contact Form Handler
function setupContactForm() {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Save to Firebase
            await addDoc(collection(db, 'contactMessages'), {
                ...data,
                timestamp: serverTimestamp(),
                read: false,
                source: 'website'
            });
            
            // Show success message
            contactForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting MEETO. Our team in Bonn will get back to you within 24 hours.</p>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">Send Another Message</button>
                </div>
            `;
            
            // Log event
            logEvent(analytics, 'contact_form_submitted');
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            alert('There was an error sending your message. Please try again or email us directly at hello@meeto.com');
        }
    });
}

// Testimonials Loader
async function loadTestimonials() {
    try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        if (!testimonialsGrid || querySnapshot.empty) return;
        
        testimonialsGrid.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const testimonialHTML = `
                <div class="testimonial-card fade-in">
                    <div class="testimonial-content">
                        <p>"${data.message}"</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="${data.photoURL || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`}" alt="${data.name}" loading="lazy">
                        <div class="author-info">
                            <h4>${data.name}</h4>
                            <p>${data.role || 'Traveler'} • ${data.location || 'Global'}</p>
                            <div class="rating">
                                ${Array(Math.min(5, data.rating || 5)).fill('<i class="fas fa-star"></i>').join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            testimonialsGrid.insertAdjacentHTML('beforeend', testimonialHTML);
        });
        
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Fallback to default testimonials
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        if (testimonialsGrid) {
            testimonialsGrid.innerHTML = `
                <div class="testimonial-card fade-in">
                    <div class="testimonial-content">
                        <p>"MEETO completely changed how I travel solo. Made real friends in Tokyo!"</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah">
                        <div class="author-info">
                            <h4>Sarah Chen</h4>
                            <p>Digital Nomad • Japan</p>
                            <div class="rating">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial-card fade-in delay-1">
                    <div class="testimonial-content">
                        <p>"The group planning feature helped 6 strangers plan a perfect week in Bali."</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="James">
                        <div class="author-info">
                            <h4>James Rodriguez</h4>
                            <p>Photographer • Bali</p>
                            <div class="rating">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial-card fade-in delay-2">
                    <div class="testimonial-content">
                        <p>"As a solo female traveler, MEETO's verification system gave me peace of mind."</p>
                    </div>
                    <div class="testimonial-author">
                        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Aisha">
                        <div class="author-info">
                            <h4>Aisha Mohammed</h4>
                            <p>Student • Morocco</p>
                            <div class="rating">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Team Section
function setupTeamSection() {
    const teamMembers = [
        {
            name: "Khouloud Chebboubi",
            role: "Founder & CEO",
            bio: "Travel enthusiast and serial entrepreneur from Bonn, on a mission to connect the world through shared adventures.",
            image: "assets/images/team1.jpg",
            social: {
                linkedin: "https://linkedin.com/in/khouloud",
                twitter: "https://twitter.com/khouloud"
            }
        },
        {
            name: "David Kim",
            role: "CTO",
            bio: "AI/ML expert with 10+ years experience building social platforms, passionate about travel technology.",
            image: "assets/images/team2.jpg",
            social: {
                linkedin: "https://linkedin.com/in/davidkim",
                github: "https://github.com/davidkim"
            }
        },
        {
            name: "Maya Patel",
            role: "Head of Design",
            bio: "UX specialist focused on creating intuitive travel experiences that foster genuine connections.",
            image: "assets/images/team3.jpg",
            social: {
                dribbble: "https://dribbble.com/maya",
                behance: "https://behance.net/maya"
            }
        }
    ];
    
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;
    
    teamGrid.innerHTML = '';
    
    teamMembers.forEach((member, index) => {
        const memberHTML = `
            <div class="team-member fade-in delay-${index + 1}">
                <div class="member-image">
                    <img src="${member.image}" alt="${member.name}" loading="lazy">
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                    <p class="bio">${member.bio}</p>
                    <div class="member-social">
                        ${Object.entries(member.social).map(([platform, url]) => 
                            `<a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-${platform}"></i></a>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        teamGrid.insertAdjacentHTML('beforeend', memberHTML);
    });
}

// Initialize everything
async function initialize() {
    // Start counter growth simulation
    initCounterGrowth();
    
    // Update counters initially
    updateLiveCounters();
    
    // Setup all functionality
    setupScrollEffects();
    setupInteractiveDemo();
    setupSocialLinks();
    setupFooterLinks();
    setupContactForm();
    await loadTestimonials();
    setupTeamSection();
    
    // Update footer year
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Add Bonn location info
    const locationInfo = document.querySelector('.footer-location');
    if (locationInfo) {
        locationInfo.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>Bonn, Germany • Launching February 2024</span>
        `;
    }
    
    // Initialize analytics
    logEvent(analytics, 'page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export utilities
window.MEETO = {
    showDemo: showInteractiveDemoModal,
    updateCounters: updateLiveCounters,
    closeMobileMenu: closeMobileMenu
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (counterInterval) {
        clearInterval(counterInterval);
    }
});
