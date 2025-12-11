document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            header.style.background = 'rgba(31, 46, 37, 0.9)'; // Darker on scroll
        } else {
            header.style.background = 'rgba(46, 64, 53, 0.7)'; // Lighter on top
        }
    });

    // 3. Burger Menu (Simple toggle for now)
    const burger = document.querySelector('.header__burger');
    // Логику открытия мобильного меню добавим полноценно с анимацией на следующих этапах
    burger.addEventListener('click', () => {
        console.log('Toggle menu');
    });

    console.log('Mirra-Drivez Core Loaded');
});