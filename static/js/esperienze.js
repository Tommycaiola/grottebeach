/* =====================================================
   Esperienze — Page JS
   ===================================================== */



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

    // Chiudi al click su un link o sul bottone "Prenota Ora"
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

/* ── Gallery: auto-scroll + drag to scrub ── */
(function () {
    var wrapper = document.querySelector('.gallery-wrapper');
    if (!wrapper) return;

    var track = wrapper.querySelector('.gallery-track');
    var speed = 0.8; // px per frame
    var rafId = null;
    var resumeTimer = null;
    var isDragging = false;
    var startX = 0;
    var scrollStart = 0;

    function tick() {
        wrapper.scrollLeft += speed;
        // Seamless loop: content è duplicato, si resetta a metà
        if (wrapper.scrollLeft >= track.scrollWidth / 2) {
            wrapper.scrollLeft -= track.scrollWidth / 2;
        }
        rafId = requestAnimationFrame(tick);
    }

    function startAuto() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
    }

    function stopAuto() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function scheduleResume() {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAuto, 2000);
    }

    // ── Mouse drag ──
    wrapper.addEventListener('mousedown', function (e) {
        isDragging = true;
        startX = e.pageX;
        scrollStart = wrapper.scrollLeft;
        stopAuto();
        clearTimeout(resumeTimer);
        wrapper.style.cursor = 'grabbing';
        wrapper.style.userSelect = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        wrapper.scrollLeft = scrollStart - (e.pageX - startX);
    });

    window.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';
        wrapper.style.userSelect = '';
        scheduleResume();
    });

    // ── Touch drag ──
    wrapper.addEventListener('touchstart', function (e) {
        startX = e.touches[0].pageX;
        scrollStart = wrapper.scrollLeft;
        stopAuto();
        clearTimeout(resumeTimer);
    }, { passive: true });

    wrapper.addEventListener('touchmove', function (e) {
        wrapper.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
    }, { passive: true });

    wrapper.addEventListener('touchend', scheduleResume);

    startAuto();
})();

/* ── Grotte video: play only when in view ── */
(function () {
    var video = document.getElementById('grotte-video');
    if (!video) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(video);
})();

/* ── Fade-up: IntersectionObserver (same as index) ── */
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

/* ── Mobile CTA bar: hide when footer is in view ── */
(function () {
    var cta = document.getElementById('mobile-cta');
    if (!cta) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            cta.style.opacity = entry.isIntersecting ? '0' : '1';
            cta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        });
    }, { threshold: 0.1 });

    var footer = document.querySelector('footer');
    if (footer) observer.observe(footer);
})();
