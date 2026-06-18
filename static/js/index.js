(function () {
    var carousel = document.getElementById('about-carousel');
    if (!carousel) return;

    var slides = Array.from(carousel.querySelectorAll('.about-slide'));
    var dotsContainer = document.getElementById('about-dots');
    var current = 0;
    var timer;

    // Generate dots
    var dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'about-dot';
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () {
            goTo(i);
            resetTimer();
        });
        dotsContainer.appendChild(dot);
        return dot;
    });

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 3000);
    }

    goTo(0);
    resetTimer();

    // Touch swipe support
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            goTo(dx < 0 ? current + 1 : current - 1);
            resetTimer();
        }
    }, { passive: true });
})();

// ── Reviews carousel ──
(function () {
    var track = document.getElementById('reviews-track');
    if (!track) return;

    var slides = Array.from(track.querySelectorAll('.review-slide'));
    var dotsContainer = document.getElementById('reviews-dots');
    var prevBtn = document.getElementById('reviews-prev');
    var nextBtn = document.getElementById('reviews-next');
    var current = 0;
    var timer;

    var dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot';
        dot.setAttribute('aria-label', 'Recensione ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
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
        timer = setInterval(function () { goTo(current + 1); }, 5500);
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
})();

// ── Gallery carousel ──
(function () {
    var track = document.getElementById('gallery-track');
    if (!track) return;

    var slides = Array.from(track.querySelectorAll('.gallery-slide'));
    var dotsContainer = document.getElementById('gallery-dots');
    var prevBtn = document.getElementById('gallery-prev');
    var nextBtn = document.getElementById('gallery-next');
    var current = 0;
    var timer;

    var dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'gallery-dot';
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
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
        timer = setInterval(function () { goTo(current + 1); }, 4000);
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
})();

// ── Gallery step (dual vertical / mobile horizontal) — loop infinito ──
(function () {
    var leftTrack  = document.getElementById('gallery-left-track');
    var rightTrack = document.getElementById('gallery-right-track');
    if (!leftTrack || !rightTrack) return;

    // Inverti le immagini del pannello destra: così entrambi i track
    // avanzano con lo stesso indice ma mostrano sequenze opposte.
    (function () {
        var imgs = Array.from(rightTrack.querySelectorAll('img'));
        imgs.forEach(function (img) { rightTrack.removeChild(img); });
        imgs.reverse().forEach(function (img) { rightTrack.appendChild(img); });
    })();

    var n = leftTrack.querySelectorAll('img').length;

    // Duplica le immagini per il loop senza salti visivi
    [leftTrack, rightTrack].forEach(function (track) {
        Array.from(track.querySelectorAll('img')).forEach(function (img) {
            track.appendChild(img.cloneNode(true));
        });
    });

    var idx       = 0;
    var snapTimer = null;

    function isMobile() { return window.innerWidth < 768; }

    function move(animate) {
        var mobile = isMobile();
        var col    = leftTrack.parentElement;
        var size   = mobile ? col.offsetWidth : col.offsetHeight;
        var ease   = animate ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' : 'none';
        var fn     = mobile ? 'translateX' : 'translateY';
        leftTrack.style.transition  = ease;
        rightTrack.style.transition = ease;
        leftTrack.style.transform   = fn + '(' + (-idx * size) + 'px)';
        rightTrack.style.transform  = fn + '(' + (-idx * size) + 'px)';
    }

    move(false);

    setInterval(function () {
        idx++;
        move(true);
        // Quando il clone è visibile (idx === n), torna all'originale senza salti
        clearTimeout(snapTimer);
        if (idx >= n) {
            snapTimer = setTimeout(function () {
                idx = 0;
                move(false);
            }, 600);
        }
    }, 3000);

    // Recalcola posizione al resize / cambio orientamento
    var lastMobile = isMobile();
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var nowMobile = isMobile();
            if (nowMobile !== lastMobile) { idx = 0; lastMobile = nowMobile; }
            move(false);
        }, 120);
    }, { passive: true });
})();

// ── Staff carousel ──
(function () {
    var carousel = document.getElementById('staff-carousel');
    if (!carousel) return;

    var slides = Array.from(carousel.querySelectorAll('.staff-slide'));
    var dotsContainer = document.getElementById('staff-dots');
    var prevBtn = document.getElementById('staff-prev');
    var nextBtn = document.getElementById('staff-next');
    var current = 0;
    var timer;

    var dots = slides.map(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'staff-dot';
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
        return dot;
    });

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 3500);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    goTo(0);
    resetTimer();

    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); resetTimer(); }
    }, { passive: true });
})();

// ── Hero fade-in on page load + IntersectionObserver for below-fold elements ──
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
            // already in viewport (hero elements)
            var delay = parseInt(el.getAttribute('data-delay') || 0);
            setTimeout(function () { el.classList.add('visible'); }, delay + 80);
        } else {
            // below the fold — trigger on scroll
            observer.observe(el);
        }
    });
})();



// ── Hamburger menu ──
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

// ── Auto-mark active link in mobile menu ──
(function () {
    var page = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    document.querySelectorAll('.mobile-menu-link').forEach(function (link) {
        if (link.getAttribute('href') === page) link.classList.add('nav-active');
    });
})();

// ── Experience cards: touch = 1º tap attiva hover, 2º tap su bottone naviga ──
(function () {
    var cards = Array.from(document.querySelectorAll('.experience-card'));
    if (!cards.length) return;

    var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    cards.forEach(function (card) {
        var btn = card.querySelector('.card-btn');
        var href = card.getAttribute('data-href');
        if (!btn) return;

        if (!isTouch) {
            // Desktop: click sul bottone (visibile dopo hover) naviga
            btn.addEventListener('click', function () {
                if (href && href !== '#') window.location.href = href;
            });
            return;
        }

        // Touch: gestione a due passi
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (card.classList.contains('is-active')) {
                // 2º tap sul bottone → naviga
                if (href && href !== '#') window.location.href = href;
            } else {
                // Tap sul bottone quando non attivo → attiva
                cards.forEach(function (c) { c.classList.remove('is-active'); });
                card.classList.add('is-active');
            }
        });

        card.addEventListener('click', function (e) {
            if (card.classList.contains('is-active')) {
                // Tap sul corpo della card attiva → chiudi
                card.classList.remove('is-active');
            } else {
                // 1º tap → attiva (mostra hover)
                cards.forEach(function (c) { c.classList.remove('is-active'); });
                card.classList.add('is-active');
            }
            e.stopPropagation();
        });
    });

    // Tap fuori da tutte le card → chiudi tutte
    document.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('is-active'); });
    });
})();


