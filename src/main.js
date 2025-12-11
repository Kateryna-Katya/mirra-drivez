document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CORE: Smooth Scroll (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        touchMultiplier: 2,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. UI: Header & Menu ---
    const header = document.querySelector('.header');
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinksContainer = document.querySelector('.mobile-menu__links');
    let isMenuOpen = false;

    // Header Blur on Scroll
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            header.style.background = 'rgba(31, 46, 37, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(46, 64, 53, 0.7)';
            header.style.backdropFilter = 'blur(12px)';
        }
    });

    // Mobile Menu Logic
    document.querySelectorAll('.header__menu a').forEach(link => {
        const clone = document.createElement('a');
        clone.href = link.href;
        clone.textContent = link.textContent;
        clone.className = 'mobile-menu__link';
        clone.addEventListener('click', () => toggleMenu(false));
        mobileLinksContainer.appendChild(clone);
    });

    function toggleMenu(open) {
        if (open === isMenuOpen) return;
        isMenuOpen = open;
        if (open) {
            burger.classList.add('is-active');
            mobileMenu.classList.add('is-active');
            lenis.stop();
            gsap.to('.mobile-menu__link', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 });
        } else {
            burger.classList.remove('is-active');
            mobileMenu.classList.remove('is-active');
            lenis.start();
            gsap.to('.mobile-menu__link', { y: 20, opacity: 0, duration: 0.3 });
        }
    }
    burger.addEventListener('click', () => toggleMenu(!isMenuOpen));

    // --- 3. VISUAL: Canvas Neural Network Animation (Hero) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Настройки
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        const connectionDistance = 150;
        const speed = 0.5;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * speed;
                this.vy = (Math.random() - 0.5) * speed;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(204, 255, 0, 0.6)'; // Accent color
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            // Обновляем и рисуем частицы
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                
                // Рисуем связи
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(204, 255, 0, ${1 - dist / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // --- 4. ANIMATION: GSAP ScrollTrigger ---
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Elements
    gsap.utils.toArray('.fade-up').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Side Fades
    gsap.from('.fade-right', {
        scrollTrigger: { trigger: '.split-layout', start: "top 80%" },
        x: -50, opacity: 0, duration: 1
    });
    gsap.from('.fade-left', {
        scrollTrigger: { trigger: '.split-layout', start: "top 80%" },
        x: 50, opacity: 0, duration: 1, delay: 0.2
    });

    // --- 5. LOGIC: Form Validation & Captcha ---
    const form = document.getElementById('main-form');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const captchaQ = document.getElementById('captcha-question');
    const captchaA = document.getElementById('captcha-answer');
    
    // Генерируем капчу
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;
    if(captchaQ) captchaQ.textContent = `${n1} + ${n2} = ?`;

    // Валидация телефона (только цифры)
    if(phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (/[^0-9+]/.test(val)) {
                phoneError.style.display = 'block';
                e.target.value = val.replace(/[^0-9+]/g, '');
            } else {
                phoneError.style.display = 'none';
            }
        });
    }

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка капчи
            if (parseInt(captchaA.value) !== n1 + n2) {
                alert('Неверное решение примера!');
                return;
            }

            // Имитация отправки
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Успешно!';
                btn.style.background = '#27c93f';
                btn.style.color = '#fff';
                form.reset();
                
                // Генерируем новую капчу
                n1 = Math.floor(Math.random() * 10) + 1;
                n2 = Math.floor(Math.random() * 10) + 1;
                captchaQ.textContent = `${n1} + ${n2} = ?`;

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // --- 6. LOGIC: Cookie Popup ---
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    if(acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('show');
        });
    }
});