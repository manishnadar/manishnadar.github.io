document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
            
            // Follower with slight delay
            follower.style.left = `${x - 20}px`;
            follower.style.top = `${y - 20}px`;
        });

        // Hover Effect
        const hoverables = document.querySelectorAll('a, button, .project-row, select, input, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Portrait Parallax
        const portraitWrapper = document.querySelector('.hero-portrait-wrapper');
        if (portraitWrapper) {
            document.addEventListener('mousemove', (e) => {
                const { clientX: x, clientY: y } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const moveX = (x - centerX) / 50;
                const moveY = (y - centerY) / 50;
                
                portraitWrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Toggle hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send API call to PHP backend
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Send API call to Formspree (Standard Post for better compatibility with static hosts)
            fetch(contactForm.action || 'https://formspree.io/f/manish.nadar95@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(async response => {
                const result = await response.json();
                return { ok: response.ok, result };
            })
            .then(({ ok, result }) => {
                if (ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = result.error || 'Oops! Something went wrong.';
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Network error: Form submission is only possible from a live URL or local server.';
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            });
        });
    }
});
