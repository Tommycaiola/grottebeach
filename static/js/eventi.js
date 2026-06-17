// eventi.js — logica pagina Eventi



/* ── Hamburger menu ── */
(function () {
    var toggle = document.getElementById('menu-toggle');
    var menu   = document.getElementById('mobile-menu');
    var icon   = document.getElementById('menu-icon');
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

/* ── Factory: crea un carosello orizzontale ── */
function makeCarousel(trackId, prevId, nextId, dotsId, interval) {
    var track   = document.getElementById(trackId);
    var dotsEl  = document.getElementById(dotsId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    if (!track) return;

    var slides  = Array.from(track.querySelectorAll('.ev-slide'));
    var current = 0;
    var timer;

    var dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'ev-dot';
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsEl.appendChild(dot);
        return dot;
    });

    function goTo(index) {
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, interval || 4500);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    goTo(0);
    resetTimer();

    // Touch swipe
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            goTo(dx < 0 ? current + 1 : current - 1);
            resetTimer();
        }
    }, { passive: true });
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
            var delay = parseInt(el.getAttribute('data-delay') || 0);
            setTimeout(function () { el.classList.add('visible'); }, delay + 80);
        } else {
            observer.observe(el);
        }
    });
})();
