// servizi.js — logica pagina Servizi



/* ── Hamburger menu ── */
(function () {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('menu-icon');
    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add('open');
        icon.textContent = 'close';
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        menu.classList.remove('open');
        icon.textContent = 'menu';
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    Array.from(menu.querySelectorAll('a, button')).forEach(function (el) {
        el.addEventListener('click', closeMenu);
    });
})();

/* ── Auto-mark active link in mobile menu ── */
(function () {
    var page = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    document.querySelectorAll('.mobile-menu-link').forEach(function (link) {
        if (link.getAttribute('href') === page) link.classList.add('nav-active');
    });
})();

/* ── CTA contatto: desktop → contact.html | mobile/touch → tel: ── */
function ctaContact() {
    var isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) {
        window.location.href = 'tel:+393891013881';
    } else {
        window.location.href = 'contact.html';
    }
}

/* ── IntersectionObserver per fade-up ── */
(function () {
    var els = Array.from(document.querySelectorAll('.fade-up'));

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var delay = parseInt(entry.target.getAttribute('data-delay') || 0);
            setTimeout(function () { entry.target.classList.add('visible'); }, delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
            // già in viewport (hero)
            var delay = parseInt(el.getAttribute('data-delay') || 0);
            setTimeout(function () { el.classList.add('visible'); }, delay + 80);
        } else {
            // sotto la fold — trigger allo scroll
            observer.observe(el);
        }
    });
})();
