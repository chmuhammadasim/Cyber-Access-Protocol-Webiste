/* ==========================================================================
   Cyber Access Protocol — site behaviours
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var isHome = !!document.querySelector('.hero');

  /* --- Header state ------------------------------------------------------ */
  if (header) {
    if (!isHome) header.classList.add('is-solid');
    var setHeaderState = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  /* --- Mobile navigation ------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    var closeNav = function () {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    };
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteNav.classList.toggle('is-open', !open);
    });
    siteNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* --- Reveal on scroll -------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

      revealItems.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var onScreen = rect.top < window.innerHeight && rect.bottom > 0;
        if (onScreen) {
          el.classList.add('is-visible');
        } else {
          revealObserver.observe(el);
        }
      });
    }
  }

  /* --- Back to top ------------------------------------------------------- */
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    var setBackTop = function () {
      backTop.classList.toggle('is-visible', window.scrollY > 640);
    };
    setBackTop();
    window.addEventListener('scroll', setBackTop, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* --- Campaign chapter navigation -------------------------------------- */
  var chapterNav = document.querySelector('.chapter-nav');
  if (chapterNav) {
    var chapterLinks = Array.prototype.slice.call(chapterNav.querySelectorAll('a[href^="#"]'));
    var chapters = chapterLinks.map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);

    var syncChapters = function () {
      var marker = window.scrollY + 180;
      var active = chapters[0];
      chapters.forEach(function (section) {
        if (section.offsetTop <= marker) active = section;
      });
      chapterLinks.forEach(function (link) {
        link.classList.toggle(
          'is-active',
          active && link.getAttribute('href') === '#' + active.id
        );
      });
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        syncChapters();
        ticking = false;
      });
    }, { passive: true });
    syncChapters();
  }

  /* --- Tabs -------------------------------------------------------------- */
  var tablists = document.querySelectorAll('[role="tablist"]');
  Array.prototype.forEach.call(tablists, function (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.setAttribute('tabindex', selected ? '0' : '-1');
        var panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    };
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === 'Home') next = tabs[0];
        if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          next.focus();
          select(next);
        }
      });
    });
  });

  /* --- Gallery filters --------------------------------------------------- */
  var filterBar = document.querySelector('.filter-bar');
  var galleryGrid = document.querySelector('.gallery-grid');
  var galleryCount = document.querySelector('.gallery-count b');
  var shots = galleryGrid
    ? Array.prototype.slice.call(galleryGrid.querySelectorAll('.shot'))
    : [];

  var applyFilter = function (filter) {
    var shown = 0;
    shots.forEach(function (shot) {
      var categories = (shot.getAttribute('data-category') || '').split(/\s+/);
      var match = filter === 'all' || categories.indexOf(filter) !== -1;
      shot.hidden = !match;
      if (match) shown += 1;
    });
    if (galleryCount) galleryCount.textContent = String(shown).padStart(2, '0');
    if (filterBar) {
      Array.prototype.forEach.call(filterBar.querySelectorAll('.filter-btn'), function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
      });
    }
  };

  if (filterBar && shots.length) {
    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('.filter-btn');
      if (!button) return;
      var filter = button.getAttribute('data-filter');
      applyFilter(filter);
      try {
        if (history.replaceState) {
          history.replaceState(null, '', filter === 'all' ? location.pathname : '#' + filter);
        }
      } catch (error) {
        /* file:// origins reject replaceState; the filter still works. */
      }
    });

    var initial = location.hash.replace('#', '');
    var known = Array.prototype.some.call(
      filterBar.querySelectorAll('.filter-btn'),
      function (btn) { return btn.getAttribute('data-filter') === initial; }
    );
    applyFilter(known ? initial : 'all');
  }

  /* --- Lightbox ---------------------------------------------------------- */
  var dialog = document.getElementById('lightbox');
  if (dialog && shots.length) {
    var dialogImage = dialog.querySelector('.lightbox__img');
    var dialogTitle = dialog.querySelector('.lightbox__caption b');
    var dialogText = dialog.querySelector('.lightbox__caption span');
    var dialogCounter = dialog.querySelector('.lightbox__counter');
    var closeButton = dialog.querySelector('[data-close]');
    var prevButton = dialog.querySelector('[data-prev]');
    var nextButton = dialog.querySelector('[data-next]');
    var currentIndex = 0;
    var currentShots = [];

    var visibleShots = function () {
      return shots.filter(function (shot) { return !shot.hidden; });
    };

    var paint = function (index) {
      currentShots = visibleShots();
      if (!currentShots.length) return;
      currentIndex = (index + currentShots.length) % currentShots.length;
      var shot = currentShots[currentIndex];
      var image = shot.querySelector('img');
      var caption = shot.querySelector('figcaption, .shot__cap');
      var captionTitle = caption ? caption.querySelector('b') : null;
      var captionText = caption ? caption.querySelector('span') : null;
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt || '';
      dialogTitle.textContent = captionTitle ? captionTitle.textContent : 'Screenshot';
      dialogText.textContent = captionText ? captionText.textContent : '';
      dialogCounter.textContent =
        String(currentIndex + 1).padStart(2, '0') + ' / ' + String(currentShots.length).padStart(2, '0');
    };

    var open = function (shot) {
      currentShots = visibleShots();
      var index = currentShots.indexOf(shot);
      paint(index < 0 ? 0 : index);
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
      if (closeButton) closeButton.focus();
    };

    var close = function () {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      document.body.style.overflow = '';
    };

    shots.forEach(function (shot) {
      shot.addEventListener('click', function () { open(shot); });
    });

    if (closeButton) closeButton.addEventListener('click', close);
    if (prevButton) prevButton.addEventListener('click', function () { paint(currentIndex - 1); });
    if (nextButton) nextButton.addEventListener('click', function () { paint(currentIndex + 1); });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) close();
    });
    dialog.addEventListener('cancel', function () {
      document.body.style.overflow = '';
    });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); paint(currentIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); paint(currentIndex + 1); }
    });
  }
  /* --- 3D interaction layer --------------------------------------------- */
  var motionOkay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (motionOkay) document.documentElement.classList.add('has-3d');

  /* Hero depth parallax */
  var hero = document.querySelector('.hero');
  if (hero && motionOkay && finePointer) {
    var heroFrame = null;
    hero.addEventListener('pointermove', function (event) {
      if (heroFrame) return;
      heroFrame = window.requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        var y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        hero.style.setProperty('--hx', x.toFixed(3));
        hero.style.setProperty('--hy', y.toFixed(3));
        heroFrame = null;
      });
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hx', '0');
      hero.style.setProperty('--hy', '0');
    });
  }

  /* Interior page hero depth */
  var pageHero = document.querySelector('.page-hero');
  if (pageHero && motionOkay && finePointer) {
    var pageFrame = null;
    pageHero.addEventListener('pointermove', function (event) {
      if (pageFrame) return;
      pageFrame = window.requestAnimationFrame(function () {
        var rect = pageHero.getBoundingClientRect();
        var x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        var y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        pageHero.style.setProperty('--hx', x.toFixed(3));
        pageHero.style.setProperty('--hy', y.toFixed(3));
        pageFrame = null;
      });
    });
    pageHero.addEventListener('pointerleave', function () {
      pageHero.style.setProperty('--hx', '0');
      pageHero.style.setProperty('--hy', '0');
    });
  }

  /* Tilt-and-glare cards */
  if (motionOkay && finePointer) {
    var tiltTargets = document.querySelectorAll(
      '.feature, .level-card, .domain, .boss, .shot, .ending, .copy-block, .card'
    );
    Array.prototype.forEach.call(tiltTargets, function (el) {
      if (el.closest('[data-deck]')) return;
      if (!el.querySelector('.tilt-glare')) {
        var glare = document.createElement('span');
        glare.className = 'tilt-glare';
        glare.setAttribute('aria-hidden', 'true');
        el.appendChild(glare);
      }
      var frame = null;
      var reset = function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      };
      el.addEventListener('pointermove', function (event) {
        if (event.pointerType === 'touch' || frame) return;
        frame = window.requestAnimationFrame(function () {
          var rect = el.getBoundingClientRect();
          var px = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          var py = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          var ry = (px - 0.5) * 7;
          var rx = (py - 0.5) * -7;
          el.classList.add('is-tilting');
          el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(4px)';
          el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          frame = null;
        });
      });
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset, true);
    });
  }

  /* 3D chapter deck */
  var deck = document.querySelector('[data-deck]');
  if (deck) {
    var ring = deck.querySelector('[data-deck-ring]');
    var deckCards = Array.prototype.slice.call(ring.querySelectorAll('.deck-card'));
    var deckButtons = deck.querySelectorAll('.deck-btn');
    var rotation = 0;
    var target = 0;
    var deckPaused = false;
    var deckVisible = false;
    var deckDragging = false;
    var dragStart = 0;
    var dragOrigin = 0;
    var dragMoved = 0;
    var lastTime = 0;

    var normalize = function (angle) {
      return ((angle + 180) % 360 + 360) % 360 - 180;
    };
    var paintDeck = function () {
      ring.style.setProperty('--deck-rot', rotation.toFixed(2) + 'deg');
      deckCards.forEach(function (card, index) {
        var angle = Math.abs(normalize(index * 60 + rotation));
        var opacity = 1 - Math.min(angle / 120, 0.7);
        card.style.setProperty('--card-opacity', opacity.toFixed(2));
        card.style.pointerEvents = angle > 118 ? 'none' : '';
      });
    };
    var tickDeck = function (time) {
      if (!deckVisible && !deckDragging && Math.abs(target - rotation) < 0.02) {
        lastTime = time;
        window.requestAnimationFrame(tickDeck);
        return;
      }
      var delta = lastTime ? Math.min(50, time - lastTime) : 16;
      lastTime = time;
      if (deckVisible && !deckPaused && !deckDragging && motionOkay) {
        target += delta * 0.006; /* ~5.4 degrees per second */
      }
      rotation += (target - rotation) * 0.085;
      if (Math.abs(target - rotation) < 0.02) rotation = target;
      paintDeck();
      window.requestAnimationFrame(tickDeck);
    };

    if ('IntersectionObserver' in window) {
      var deckObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { deckVisible = entry.isIntersecting; });
      }, { threshold: 0.15 });
      deckObserver.observe(deck);
    } else {
      deckVisible = true;
    }

    deck.addEventListener('pointerenter', function () { deckPaused = true; });
    deck.addEventListener('pointerleave', function () { deckPaused = false; });
    deck.addEventListener('focusin', function () { deckPaused = true; });
    deck.addEventListener('focusout', function () { deckPaused = false; });

    Array.prototype.forEach.call(deckButtons, function (button) {
      button.addEventListener('click', function () {
        var step = button.hasAttribute('data-deck-next') ? 60 : -60;
        target = Math.round((target + step) / 60) * 60;
      });
    });

    deckCards.forEach(function (card, index) {
      card.addEventListener('focus', function () {
        target = Math.round(-index * 60);
      });
    });

    deck.addEventListener('pointerdown', function (event) {
      if (event.target.closest('button')) return;
      deckDragging = true;
      dragStart = event.clientX;
      dragOrigin = target;
      dragMoved = 0;
      deck.setPointerCapture(event.pointerId);
    });
    deck.addEventListener('pointermove', function (event) {
      if (!deckDragging) return;
      dragMoved = Math.max(dragMoved, Math.abs(event.clientX - dragStart));
      target = dragOrigin + (event.clientX - dragStart) * 0.35;
    });
    var endDrag = function () {
      if (!deckDragging) return;
      deckDragging = false;
      target = Math.round(target / 60) * 60;
    };
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);
    deck.addEventListener('click', function (event) {
      if (dragMoved > 6) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = 0;
      }
    }, true);

    paintDeck();
    window.requestAnimationFrame(tickDeck);
  }
})();
