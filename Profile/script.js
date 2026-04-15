document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initTypingEffect();
    initOrbitAnimations();
    initSunPhotoModal();
    initSmoothScroll();
    initSectionAnimations();
    initContactForm(); // Contact formni ishga tushiramiz
});

// ================= NAVBAR =================
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });
    
    sections.forEach(section => observer.observe(section));
}

// ================= TYPING EFFECT =================
function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const phrases = ['Web Developer','Front-End','Problem Solver','Code Explorer','AI Explorer','Innovator' ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();
}

// ================= PLANET ORBIT ANIMATIONS =================
function initOrbitAnimations() {
    const planets = document.querySelectorAll('.random-orbit');
    planets.forEach((planet, index) => {
        const startAngle = Math.random() * 360;
        const radius = 120 + (index * 40);
        const duration = 15 + Math.random() * 15;
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

        planet.style.transform = `rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg)`;

        const animationName = `orbit${index}`;
        const keyframes = `
            @keyframes ${animationName} {
                from { transform: rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg); }
                to { transform: rotate(${startAngle + 360}deg) translateX(${radius}px) rotate(-${startAngle + 360}deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        planet.style.animation = `${animationName} ${duration}s linear infinite ${direction}`;

        planet.addEventListener('mouseenter', () => planet.style.animationPlayState = 'paused');
        planet.addEventListener('mouseleave', () => planet.style.animationPlayState = 'running');
    });
}

// ================= SUN PHOTO MODAL =================
function initSunPhotoModal() {
    const sun = document.querySelector('.sun-core');
    const modal = document.getElementById('photo-modal');
    const closeBtn = document.querySelector('.close');
    const randomPhoto = document.getElementById('random-photo');

    if (sun && modal && closeBtn && randomPhoto) {
        sun.addEventListener('click', () => {
            const randomId = Math.floor(Math.random() * 1000) + 1;
            randomPhoto.src = `https://picsum.photos/600/400?random=${randomId}`;
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.style.display = 'none'; });
    }
}

// ================= SMOOTH SCROLL =================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ================= SECTION ANIMATIONS =================
function initSectionAnimations() {
    const elements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                if (entry.target.classList.contains('slide-in-left')) entry.target.style.transform = 'translateX(0)';
                else if (entry.target.classList.contains('slide-in-right')) entry.target.style.transform = 'translateX(0)';
                else entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(element => elementObserver.observe(element));
}

// ================= CONTACT FORM (Formspree + AJAX) =================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const emailValue = emailInput ? emailInput.value.trim() : "";

        // 1. Birinchi navbatda oddiy format tekshiruvi (Regex)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailValue)) {
            showPopup("❌ Email formati xato!");
            return;
        }

        // Tugmani kutish rejimiga o'tkazish
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Tekshirilmoqda...";
        submitBtn.disabled = true;

        try {
            // 2. Abstract API orqali haqiqiy ekanligini tekshirish
            const API_KEY = "26b68213c6684486a36ca9743d5527fe";
            const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${emailValue}`);
            const data = await response.json();

            // Agar email haqiqatda mavjud bo'lsa (deliverability === "DELIVERABLE")
            if (data.deliverability === "DELIVERABLE") {
                
                // 3. Formspree-ga yuborish
                const formData = new FormData(form);
                const formResponse = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (formResponse.ok) {
                    showPopup("✅ Xabaringiz muvaffaqiyatli yuborildi!");
                    form.reset();
                    emailInput.style.border = "none";
                } else {
                    showPopup("❌ Formspree-da xatolik yuz berdi.");
                }

            } else {
                // Agar email formatga tushsa-yu, lekin mavjud bo'lmasa (fake bo'lsa)
                showPopup("❌ Bunday email manzili mavjud emas!");
                emailInput.style.border = "2px solid red";
            }

        } catch (error) {
            // Internet uzilib qolsa yoki API'da muammo bo'lsa
            console.error("Xatolik:", error);
            showPopup("⚠️ Tarmoq xatosi. Iltimos, qayta urinib ko'ring.");
        } finally {
            // Tugmani asl holiga qaytarish
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ================= POPUP FUNCTION =================
function showPopup(message) {
    let popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '30px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.backgroundColor = '#4caf50';
    popup.style.color = '#fff';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9999';
    popup.style.fontSize = '16px';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(popup);

    setTimeout(() => popup.style.opacity = '1', 10);
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => document.body.removeChild(popup), 300);
    }, 3000);
}
