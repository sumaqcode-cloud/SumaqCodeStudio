// =============================================
// SUMAQCODE — script.js
// =============================================

// =============================================
// 0. JS ACTIVO
// =============================================
document.documentElement.classList.remove('no-js');

// =============================================
// 0.1 TICKER — duplicar contenido para bucle infinito
// =============================================
(function () {
    const ticker = document.querySelector('.ticker');
    if (!ticker) return;
    const items = Array.from(ticker.children);
    if (items.length === 0) return;
    ticker.append(...items.map(node => node.cloneNode(true)));
})();

// =============================================
// 1. HAMBURGER MENU
// =============================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mainNav      = document.getElementById('main-nav');
const navOverlay   = document.getElementById('nav-overlay');

function setMenuOpen(isOpen) {
    hamburgerBtn.classList.toggle('active', isOpen);
    mainNav.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

    if (navOverlay) {
        navOverlay.hidden = !isOpen;
        navOverlay.classList.toggle('is-visible', isOpen);
    }
}

hamburgerBtn.addEventListener('click', () => {
    setMenuOpen(!hamburgerBtn.classList.contains('active'));
});

mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

navOverlay?.addEventListener('click', () => setMenuOpen(false));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hamburgerBtn.classList.contains('active')) {
        setMenuOpen(false);
        hamburgerBtn.focus();
    }
});

// =============================================
// 2. HEADER — sombra al hacer scroll
// =============================================
const header = document.querySelector('header');
let scrollQueued = false;

window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        scrollQueued = false;
    });
}, { passive: true });

// =============================================
// 3. INTERSECTION OBSERVER — animaciones scroll
// =============================================
const animatedEls = document.querySelectorAll('.animate-on-scroll');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (reduceMotion.matches) {
    animatedEls.forEach(el => el.classList.add('visible'));
} else {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => scrollObserver.observe(el));
}

function applyStagger(selector, delay = 0.1) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.style.transitionDelay = `${i * delay}s`;
    });
}

if (!reduceMotion.matches) {
    applyStagger('.service-card',  0.1);
    applyStagger('.work-card',     0.1);
    applyStagger('.plan-card',     0.1);
    applyStagger('.process-step',  0.12);
    applyStagger('.faq-item',      0.07);
}

// =============================================
// 4. FAQ ACCORDION
// =============================================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item     = btn.closest('.faq-item');
        const isOpen   = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

const firstFaq = document.querySelector('.faq-item');
if (firstFaq) {
    firstFaq.classList.add('open');
    firstFaq.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
}

// =============================================
// 5. SELECCIÓN DE PLAN
// =============================================
const planButtons = document.querySelectorAll('.plan-select');
const planSelection = document.getElementById('plan-selection');
const planSelectionText = planSelection?.querySelector('.plan-selection-text');
const planSelectionCta = document.getElementById('plan-selection-cta');

planButtons.forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.plan-card');

        document.querySelectorAll('.plan-card.selected').forEach(selectedCard => {
            selectedCard.classList.remove('selected');
        });
        card.classList.add('selected');
        planSelection?.classList.add('selected');

        const planName = button.dataset.plan;
        if (planSelectionText) {
            planSelectionText.textContent = `Plan ${planName} seleccionado. Cuéntanos brevemente sobre tu negocio y te responderemos con una propuesta clara.`;
        }
        if (planSelectionCta) {
            planSelectionCta.href = `https://wa.me/51945625991?text=${button.dataset.message}`;
            planSelectionCta.textContent = `Continuar con ${planName} por WhatsApp`;
        }
    });
});

// =============================================
// 6. PARTÍCULAS DE FONDO (canvas)
// =============================================
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas?.getContext?.('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    if (!canvas) return;
    particles = [];
    const isMobile = canvas.width < 768;
    const density = isMobile ? 70000 : 38000;
    const maxCount = isMobile ? 48 : 110;
    const count = Math.min(maxCount, Math.floor((canvas.width * canvas.height) / density));
    for (let i = 0; i < count; i++) {
        particles.push({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            radius:  Math.random() * 1.4 + 0.3,
            opacity: Math.random() * 0.45 + 0.08,
            vx:      (Math.random() - 0.5) * 0.22,
            vy:      (Math.random() - 0.5) * 0.22,
            color:   Math.random() > 0.5 ? '124,77,255' : '0,229,255'
        });
    }
}

function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const connect = canvas.width >= 768;

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
    });

    if (connect) {
        const maxDist = 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124,77,255,${0.07 * (1 - dist / maxDist)})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    animFrame = requestAnimationFrame(drawParticles);
}

function startParticles() {
    if (!canvas || !ctx) return;
    cancelAnimationFrame(animFrame);
    resizeCanvas();
    createParticles();
    if (!reduceMotion.matches && !document.hidden) drawParticles();
}

startParticles();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        startParticles();
    }, 200);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else if (!reduceMotion.matches) drawParticles();
});

reduceMotion.addEventListener('change', startParticles);
