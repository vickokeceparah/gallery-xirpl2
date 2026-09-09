// ========================================
// MAIN APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- PRELOADER ----------
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);

    // ---------- NAVIGATION ----------
    const hamburger = document.getElementById('hamburgerToggle');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('open');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });

        // Close nav on link click (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // ---------- SEARCH ----------
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('open');
            if (searchBar.classList.contains('open')) {
                searchInput.focus();
            }
        });
    }

    // ---------- THEME TOGGLE ----------
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('theme') || 'dark';

    if (themeToggle) {
        // Apply saved theme
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }

        themeToggle.addEventListener('click', function() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeToggle.querySelector('i').className = 'fas fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        });
    }

    // ---------- ACTIVE NAV LINK ----------
    const navLinksList = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ---------- STAT COUNTER ----------
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        };
        updateCounter();
    };

    // Intersection Observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ---------- REVEAL ON SCROLL ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                btn.style.background = '#22c55e';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }

    console.log('🚀 Keluarga.space · Galeri Futuristik siap!');
});