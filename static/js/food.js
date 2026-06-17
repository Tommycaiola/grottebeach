/* =====================================================
   Food — Page JS
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

/* ── Fade-up: IntersectionObserver ── */
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

/* ── Carosello piatti: auto-scroll + drag manuale ─────────────────── */
(function () {
    var carousel = document.getElementById('dish-carousel');
    if (!carousel) return;

    var autoTimer   = null;
    var resumeTimer = null;
    var isDown      = false;
    var startX, savedLeft;

    var STEP         = 1.2;  // px per tick
    var TICK         = 20;   // ms tra ogni tick
    var RESUME_DELAY = 3500; // ms prima di riprendere l'auto-scroll

    function startAuto() {
        if (autoTimer) return;
        autoTimer = setInterval(function () {
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2) {
                carousel.scrollLeft = 0;
            } else {
                carousel.scrollLeft += STEP;
            }
        }, TICK);
    }

    function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    function onInteract() {
        stopAuto();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAuto, RESUME_DELAY);
    }

    carousel.addEventListener('mousedown', function (e) {
        isDown = true;
        onInteract();
        carousel.classList.add('is-dragging');
        startX    = e.pageX - carousel.getBoundingClientRect().left;
        savedLeft = carousel.scrollLeft;
    });
    document.addEventListener('mouseup', function () {
        if (!isDown) return;
        isDown = false;
        carousel.classList.remove('is-dragging');
    });
    carousel.addEventListener('mouseleave', function () {
        if (isDown) { isDown = false; carousel.classList.remove('is-dragging'); }
    });
    carousel.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - carousel.getBoundingClientRect().left;
        carousel.scrollLeft = savedLeft - (x - startX) * 1.6;
    });

    carousel.addEventListener('touchstart', onInteract, { passive: true });
    carousel.addEventListener('wheel',      onInteract, { passive: true });

    startAuto();
})();

/* ── Modal selezione lingua menù ──────────────────────────────── */
(function () {
    var modal      = document.getElementById('menu-lang-modal');
    if (!modal) return;

    var card          = document.getElementById('modal-card');
    var backdrop      = document.getElementById('modal-backdrop');
    var closeBtn      = document.getElementById('modal-close');
    var backBtn       = document.getElementById('modal-back');
    var stepLang      = document.getElementById('modal-step-lang');
    var stepMenu      = document.getElementById('modal-step-menu');
    var modalTitle    = document.getElementById('modal-title');
    var svcLabel      = document.getElementById('modal-service-label');
    var langLabel     = document.getElementById('modal-lang-label');
    var viewMenuBtn   = document.getElementById('modal-view-menu-btn');
    var canvaOverlay  = document.getElementById('menu-img-overlay');
    var canvaCloseBtn = document.getElementById('menu-img-close');
    var canvaIframe   = null; // non più usato
    var canvaTitle    = document.getElementById('menu-img-title');
    var backLabel     = document.getElementById('modal-back-label');
    var viewLabel     = document.getElementById('modal-view-label');

    // Immagini menù per lingua (ordinate numericamente)
    var MENU_IMAGES = {
        it: [
            '/static/img/food/menu_ita/1.jpg',
            '/static/img/food/menu_ita/3.jpg',
            '/static/img/food/menu_ita/5.jpg',
            '/static/img/food/menu_ita/7.jpg'
        ],
        en: [
            '/static/img/food/menu_en/2.jpg',
            '/static/img/food/menu_en/4.jpg',
            '/static/img/food/menu_en/6.jpg',
            '/static/img/food/menu_en/7.jpg'
        ]
    };

    var menuImgSlide   = document.getElementById('menu-img-slide');
    var menuImgCounter = document.getElementById('menu-img-counter');
    var menuImgDots    = document.getElementById('menu-img-dots');
    var menuImgPrev    = document.getElementById('menu-img-prev');
    var menuImgNext    = document.getElementById('menu-img-next');
    var currentImgIdx  = 0;
    var currentImgs    = [];

    function renderDots() {
        menuImgDots.innerHTML = '';
        currentImgs.forEach(function (_, i) {
            var d = document.createElement('button');
            d.className = 'w-2 h-2 rounded-full transition-colors ' + (i === currentImgIdx ? 'bg-primary' : 'bg-primary/25');
            d.setAttribute('aria-label', 'Pagina ' + (i + 1));
            d.addEventListener('click', function () { goTo(i); });
            menuImgDots.appendChild(d);
        });
    }

    function goTo(idx) {
        currentImgIdx = (idx + currentImgs.length) % currentImgs.length;
        menuImgSlide.src = currentImgs[currentImgIdx];
        menuImgSlide.alt = 'Menù Grotte Beach — pagina ' + (currentImgIdx + 1);
        menuImgCounter.textContent = (currentImgIdx + 1) + ' / ' + currentImgs.length;
        renderDots();
    }

    menuImgPrev.addEventListener('click', function () { goTo(currentImgIdx - 1); });
    menuImgNext.addEventListener('click', function () { goTo(currentImgIdx + 1); });

    // Swipe touch
    (function () {
        var startX = 0;
        menuImgSlide.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        menuImgSlide.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? currentImgIdx + 1 : currentImgIdx - 1);
        });
    })();

    // Tastiera frecce
    document.addEventListener('keydown', function (e) {
        if (canvaOverlay.classList.contains('opacity-0')) return;
        if (e.key === 'ArrowRight') goTo(currentImgIdx + 1);
        if (e.key === 'ArrowLeft')  goTo(currentImgIdx - 1);
    });

    var currentService = '';
    var currentLang    = '';

    var serviceNames = {
        it: { colazione: 'Colazione',  pranzo: 'Pranzo',  aperitivo: 'Aperitivo' },
        en: { colazione: 'Breakfast',  pranzo: 'Lunch',   aperitivo: 'Aperitivo' }
    };
    function svcName(service, lang) {
        return (serviceNames[lang] && serviceNames[lang][service]) || service;
    }
    var langNames = {
        it: 'Italiano',
        en: 'English'
    };

    function openModal(service) {
        currentService = service;
        svcLabel.textContent   = svcName(service, 'it');
        modalTitle.textContent = 'Scegli la lingua';
        stepLang.classList.remove('hidden');
        stepMenu.classList.add('hidden');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                card.classList.remove('scale-95');
            });
        });
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        card.classList.add('scale-95');
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    // Testi del modal per lingua
    var modalTexts = {
        it: { title: 'Scegli la lingua', subtitle: 'Men\u00f9', back: 'Cambia lingua', view: 'Vedi Men\u00f9' },
        en: { title: 'Choose language',  subtitle: 'Menu',      back: 'Change language', view: 'View Menu' }
    };

    function showLang(lang) {
        currentLang = lang;
        var t = modalTexts[lang] || modalTexts.it;
        langLabel.textContent  = svcName(currentService, lang) + ' \u2014 ' + (lang === 'en' ? 'English' : 'Italiano');
        modalTitle.textContent = lang === 'en' ? 'English' : 'Italiano';
        svcLabel.textContent   = t.subtitle;
        if (backLabel)  backLabel.textContent = t.back;
        if (viewLabel)  viewLabel.textContent = t.view;

        stepLang.classList.add('hidden');
        stepMenu.classList.remove('hidden');
    }

    document.querySelectorAll('.vedi-menu-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal(btn.dataset.service); });
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { showLang(btn.dataset.lang); });
    });

    backBtn.addEventListener('click', function () {
        stepMenu.classList.add('hidden');
        stepLang.classList.remove('hidden');
        modalTitle.textContent = 'Scegli la lingua';
        svcLabel.textContent   = svcName(currentService, 'it');
        if (backLabel)  backLabel.textContent = 'Cambia lingua';
        if (viewLabel)  viewLabel.textContent = 'Vedi Men\u00f9';
    });

    viewMenuBtn.addEventListener('click', function () {
        closeModal();
        currentImgs   = MENU_IMAGES[currentLang] || MENU_IMAGES.it;
        currentImgIdx = 0;
        canvaTitle.textContent = (currentLang === 'en' ? 'Menu' : 'Menù') + ' — Grotte Beach';
        goTo(0);
        canvaOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    });

    function closeCanva() {
        canvaOverlay.classList.add('opacity-0', 'pointer-events-none');
        menuImgSlide.src = '';
        document.body.style.overflow = '';
    }

    canvaCloseBtn.addEventListener('click', closeCanva);
    canvaOverlay.addEventListener('click', function (e) {
        if (e.target === canvaOverlay) closeCanva();
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); closeCanva(); }
    });
})();