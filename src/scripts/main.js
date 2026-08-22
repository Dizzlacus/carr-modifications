// Carr Modifications — global scripts

(function () {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

(function () {
  const burger = document.getElementById("nav-burger");
  const mobileMenu = document.getElementById("nav-mobile-panel");
  const iconOpen = document.getElementById("icon-hamburger");
  const iconClose = document.getElementById("icon-close");
  const header = document.getElementById("site-header");
  if (!burger || !mobileMenu || !iconOpen || !iconClose) return;

  function isOpen() {
    return mobileMenu.classList.contains("is-open");
  }

  function openMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    iconOpen.classList.add("is-hidden");
    iconClose.classList.remove("is-hidden");
    header?.classList.add("is-menu-open");
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    iconOpen.classList.remove("is-hidden");
    iconClose.classList.add("is-hidden");
    header?.classList.remove("is-menu-open");
  }

  burger.addEventListener("click", () => {
    isOpen() ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    if (burger.contains(e.target) || mobileMenu.contains(e.target)) return;
    closeMenu();
  });
})();

(function () {
  const header = document.getElementById("site-header");
  if (!header) return;

  let ticking = false;

  function updateChrome() {
    header.classList.toggle("is-sticky", window.scrollY > 10);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateChrome);
  }

  updateChrome();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateChrome);
})();

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
})();

(function () {
  const root = document.getElementById("reviews");
  if (!root) return;

  const track = root.querySelector("[data-reviews-track]");
  const prev = root.querySelector("[data-reviews-prev]");
  const next = root.querySelector("[data-reviews-next]");
  if (!track || !prev || !next) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slides = track.querySelectorAll("[data-reviews-slide]");
  const cards = root.querySelectorAll("[data-review-card]");

  function syncTruncate() {
    cards.forEach((card) => {
      const quote = card.querySelector("[data-review-quote]");
      const more = card.querySelector("[data-review-more]");
      if (!quote || !more) return;
      if (card.classList.contains("is-expanded")) {
        more.hidden = false;
        return;
      }
      more.hidden = quote.scrollHeight <= quote.clientHeight + 1;
    });
  }

  const quoteCancels = new WeakMap();

  function collapsedQuoteHeight(quote) {
    const lineHeight = parseFloat(getComputedStyle(quote).lineHeight);
    return lineHeight * 5;
  }

  function syncHasExpanded() {
    track.classList.toggle(
      "has-expanded",
      Array.from(cards).some(
        (item) =>
          item.classList.contains("is-expanded") ||
          item.classList.contains("is-animating")
      )
    );
  }

  function stopQuoteAnim(quote) {
    const cancel = quoteCancels.get(quote);
    if (!cancel) return;
    cancel();
    quoteCancels.delete(quote);
  }

  function setExpanded(card, expanded) {
    const quote = card.querySelector("[data-review-quote]");
    const more = card.querySelector("[data-review-more]");
    const already = card.classList.contains("is-expanded");

    if (more) {
      more.setAttribute("aria-expanded", expanded ? "true" : "false");
      more.textContent = expanded ? "Read less" : "Read more";
    }

    if (already === expanded && !card.classList.contains("is-animating")) {
      syncHasExpanded();
      return;
    }

    if (!quote || reduceMotion) {
      card.classList.toggle("is-expanded", expanded);
      card.classList.remove("is-animating");
      if (quote) quote.style.height = "";
      syncHasExpanded();
      return;
    }

    stopQuoteAnim(quote);
    const from = quote.getBoundingClientRect().height;
    card.classList.toggle("is-expanded", expanded);
    card.classList.add("is-animating");
    quote.style.height = `${from}px`;
    syncHasExpanded();

    const settle = () => {
      card.classList.remove("is-animating");
      quote.style.height = "";
      quote.style.transitionDuration = "";
      syncHasExpanded();
      syncTruncate();
    };

    const applyTo = () => {
      let to;
      if (expanded) {
        quote.style.transitionDuration = "0ms";
        quote.style.height = "auto";
        to = quote.getBoundingClientRect().height;
        quote.style.height = `${from}px`;
        void quote.offsetHeight;
      } else {
        to = collapsedQuoteHeight(quote);
      }
      if (Math.abs(to - from) < 1) {
        settle();
        return;
      }
      const ms = Math.min(560, Math.max(320, Math.abs(to - from) * 0.5));
      quote.style.transitionDuration = `${ms}ms`;
      quote.style.height = `${to}px`;

      let settled = false;
      const finish = (event) => {
        if (settled) return;
        if (event && event.target !== quote) return;
        if (event && event.propertyName && event.propertyName !== "height") return;
        settled = true;
        stopQuoteAnim(quote);
        settle();
      };

      quote.addEventListener("transitionend", finish);
      const timer = window.setTimeout(finish, ms + 80);
      quoteCancels.set(quote, () => {
        quote.removeEventListener("transitionend", finish);
        window.clearTimeout(timer);
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(applyTo));
  }

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const more = target.closest("[data-review-more]");
    if (!more) return;
    const card = more.closest("[data-review-card]");
    if (!card) return;
    const expanding = !card.classList.contains("is-expanded");
    cards.forEach((other) => {
      if (other !== card) setExpanded(other, false);
    });
    setExpanded(card, expanding);
    syncTruncate();
  });

  function slideSize() {
    const slide = slides[0];
    if (!slide) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  function updateControls() {
    const max = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    prev.disabled = left <= 1;
    next.disabled = left >= max - 1;
  }

  function scrollByDir(dir) {
    track.scrollBy({
      left: dir * slideSize(),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  function snapToNearest() {
    const size = slideSize();
    if (!size) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const index = Math.round(track.scrollLeft / size);
    const left = Math.min(Math.max(0, index * size), maxScroll);
    track.scrollTo({
      left,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  prev.addEventListener("click", () => scrollByDir(-1));
  next.addEventListener("click", () => scrollByDir(1));

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, a")) return;
    event.preventDefault();
    dragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    track.scrollLeft = startScroll - dx;
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    if (moved) snapToNearest();
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("lostpointercapture", () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (moved) snapToNearest();
  });

  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateControls();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateControls();
    syncTruncate();
  });
  updateControls();

  const startTruncate = () => syncTruncate();
  if (document.fonts?.ready) {
    document.fonts.ready.then(startTruncate);
  } else {
    startTruncate();
  }
})();
