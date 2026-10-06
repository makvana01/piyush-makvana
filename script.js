/**
 * PIYUSH MAKVANA - PORTFOLIO INTERACTION ENGINE
 * Featuring:
 * 1. Centered Preloader with Dual Converging Lines & Shutter Page Close
 * 2. Scroll-Driven Hero Photo Shrink & FLIP Docking (Matteo Fabbiani Style)
 * 3. Studio Freight Lenis + GSAP ScrollTrigger Integration
 * 4. 12-Column Theatrical Flap Menu Drawer
 * 5. Card Spotlight Border Glow Matrix
 * 6. Copy-to-Clipboard 3-State Micro-Interaction
 * 7. FAQ Accordion & Live Month Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. DYNAMIC MONTH AVAILABILITY ENGINE
  initAvailabilityMonth();

  // 2. STUDIO FREIGHT LENIS SMOOTH SCROLLING
  const lenis = initSmoothScroll();

  // 3. CENTERED PRELOADER WITH DUAL CONVERGING LINES & SHUTTER PAGE CLOSE
  initCenteredPreloader();

  // 4. SCROLL-DRIVEN HERO PHOTO SHRINK INTO ABOUT PILL
  initHeroPhotoScrollMorph();

  // 5. CUSTOM INTERACTIVE CURSOR
  initCustomCursor();

  // 6. 12-COLUMN THEATRICAL FLAP NAVIGATION
  initFlapNavigation(lenis);

  // 7. CARD SPOTLIGHT BORDER GLOW MATRIX
  initCardGlowMatrix();

  // 8. COPY TO CLIPBOARD MICRO-INTERACTION
  initCopyEmail();

  // 9. ACCORDION FAQS
  initFaqAccordion();

  // 10. SCROLL TRIGGER ANIMATIONS
  initScrollAnimations();
});

/* ==========================================================================
   1. DYNAMIC MONTH AVAILABILITY ENGINE
   ========================================================================== */
function initAvailabilityMonth() {
  const elements = document.querySelectorAll("[data-month-availability]");
  if (!elements.length) return;

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonthIndex = now.getMonth();

  let targetMonthIndex;
  let targetYear = now.getFullYear();

  // If before 7th of month, show current month; otherwise show next month
  if (currentDay < 7) {
    targetMonthIndex = currentMonthIndex;
  } else {
    targetMonthIndex = (currentMonthIndex + 1) % 12;
    if (currentMonthIndex === 11) {
      targetYear += 1;
    }
  }

  const dateObj = new Date(targetYear, targetMonthIndex, 1);
  const monthName = dateObj.toLocaleString("en-US", { month: "long" });

  elements.forEach((el) => {
    el.textContent = `${monthName} ${targetYear}`;
  });
}

/* ==========================================================================
   2. STUDIO FREIGHT LENIS SMOOTH SCROLL & GSAP SYNC
   ========================================================================== */
function initSmoothScroll() {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis library not detected.");
    return null;
  }

  const lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.85,
    infinite: false,
    gestureOrientation: "vertical",
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Connect anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, {
            offset: -80,
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    });
  });

  return lenis;
}

/* ==========================================================================
   3. CENTERED PRELOADER WITH DUAL CONVERGING LINES & SHUTTER PAGE CLOSE
   ========================================================================== */
function initCenteredPreloader() {
  const preloader = document.getElementById("preloader");
  const counterEl = document.querySelector(".preloader-counter");
  const fillLeft = document.getElementById("fill-left");
  const fillRight = document.getElementById("fill-right");
  const centerNode = document.getElementById("center-node");

  if (!preloader || !counterEl) return;

  let startVal = 40;
  let duration = 1350; // ms

  if (sessionStorage.getItem("portfolio_visited")) {
    startVal = 65;
    duration = 750;
  }
  sessionStorage.setItem("portfolio_visited", "true");

  const startTime = performance.now();

  function updatePreloader(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Custom cubic-bezier easing approximation
    const easeProgress = easeOutCubic(progress);
    const currentCount = Math.round(startVal + (100 - startVal) * easeProgress);

    counterEl.textContent = currentCount;

    // Dual lines expanding from both outer sides meeting in the center
    const percentWidth = `${easeProgress * 100}%`;
    if (fillLeft) fillLeft.style.width = percentWidth;
    if (fillRight) fillRight.style.width = percentWidth;

    if (progress < 1) {
      requestAnimationFrame(updatePreloader);
    } else {
      // Lines meet in the center!
      if (centerNode) centerNode.classList.add("active");

      // Theatrical shutter close: Shutters slam in from both sides to close the page
      setTimeout(() => {
        preloader.classList.add("shutting");
      }, 150);

      // Then split open / wipe to unveil the hero section
      setTimeout(() => {
        preloader.classList.add("opening");
        triggerHeroReveal();
      }, 650);

      // Complete and remove preloader
      setTimeout(() => {
        preloader.classList.add("completed");
      }, 1250);
    }
  }

  requestAnimationFrame(updatePreloader);
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function triggerHeroReveal() {
  const heroH1s = document.querySelectorAll(".hero-h1");
  const heroDesc = document.querySelector(".hero-description");
  const heroActions = document.querySelector(".hero-actions");
  const heroImage = document.querySelector(".hero-image-container");

  heroH1s.forEach((h1, idx) => {
    setTimeout(() => {
      h1.classList.add("revealed");
    }, idx * 120);
  });

  if (heroDesc) {
    setTimeout(() => heroDesc.classList.add("revealed"), 400);
  }
  if (heroActions) {
    setTimeout(() => heroActions.classList.add("revealed"), 550);
  }
  if (heroImage) {
    setTimeout(() => heroImage.classList.add("revealed"), 300);
  }
}

/* ==========================================================================
   4. SCROLL-DRIVEN HERO PHOTO SHRINK INTO ABOUT PILL (Matteo Style)
   ========================================================================== */
function initHeroPhotoScrollMorph() {
  const heroBox = document.getElementById("hero-image-container");
  const heroPortrait = document.getElementById("hero-portrait-img");
  const targetSlot = document.getElementById("about-photo-slot");
  const morphPhoto = document.getElementById("scroll-morph-photo");

  if (!heroBox || !targetSlot || !morphPhoto) return;

  function updateMorph() {
    if (window.innerWidth < 768) {
      // On small mobile screens, keep standard layout
      morphPhoto.classList.remove("active");
      if (heroPortrait) heroPortrait.style.opacity = "1";
      return;
    }

    const heroRect = heroBox.getBoundingClientRect();
    const targetRect = targetSlot.getBoundingClientRect();

    // Scroll progress trigger range
    // Start morphing as soon as user begins scrolling down from hero
    const heroTop = heroRect.top;
    const windowH = window.innerHeight;

    // Trigger distance: from hero middle to about section top
    const startPoint = windowH * 0.15;
    const endPoint = targetRect.top;

    // Calculate normalized progress between hero and target slot
    // We base progress on how close targetSlot is to its resting viewport position
    const totalDistance = heroBox.offsetTop - targetSlot.offsetTop;
    const scrollY = window.scrollY;

    const startScroll = heroBox.offsetTop - windowH * 0.25;
    const endScroll = targetSlot.offsetTop - windowH * 0.45;

    let progress = (scrollY - startScroll) / (endScroll - startScroll);
    progress = Math.max(0, Math.min(progress, 1));

    if (progress <= 0.02) {
      // At top: Hero photo is in hero frame
      morphPhoto.classList.remove("active");
      if (heroPortrait) heroPortrait.style.opacity = "1";
      targetSlot.classList.remove("docked");
    } else if (progress >= 0.98) {
      // Fully docked in About headline
      morphPhoto.classList.remove("active");
      if (heroPortrait) heroPortrait.style.opacity = "0.2";
      targetSlot.classList.add("docked");
    } else {
      // Mid-flight: Morph floating photo shrinks and slides
      morphPhoto.classList.add("active");
      if (heroPortrait) heroPortrait.style.opacity = "0";
      targetSlot.classList.remove("docked");

      // Smooth interpolation between hero rect and target pill rect
      const currentX = heroRect.left + (targetRect.left - heroRect.left) * progress;
      const currentY = heroRect.top + (targetRect.top - heroRect.top) * progress;
      const currentW = heroRect.width + (targetRect.width - heroRect.width) * progress;
      const currentH = heroRect.height + (targetRect.height - heroRect.height) * progress;
      const currentRadius = 24 + (999 - 24) * progress;

      morphPhoto.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      morphPhoto.style.width = `${currentW}px`;
      morphPhoto.style.height = `${currentH}px`;
      morphPhoto.style.borderRadius = `${currentRadius}px`;
    }
  }

  // Attach to scroll and resize
  window.addEventListener("scroll", updateMorph, { passive: true });
  window.addEventListener("resize", updateMorph);
  updateMorph();
}

/* ==========================================================================
   5. CUSTOM INTERACTIVE CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".custom-cursor-follower");
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Hover states on clickable targets
  const clickables = document.querySelectorAll("a, button, .work-card-wrapper, .service-card, .faq-trigger, .inline-pill");
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

/* ==========================================================================
   6. 12-COLUMN THEATRICAL FLAP NAVIGATION
   ========================================================================== */
function initFlapNavigation(lenis) {
  const toggleBtn = document.querySelector(".hamburger-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const flapItems = document.querySelectorAll(".flap-item");
  const navLinks = document.querySelectorAll(".menu-nav-link");

  if (!toggleBtn || !menuOverlay) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    document.body.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);

    if (isOpen) {
      menuOverlay.classList.add("active");
      if (lenis) lenis.stop();
      // Stagger flaps
      flapItems.forEach((flap, idx) => {
        flap.style.transitionDelay = `${idx * 28}ms`;
      });
    } else {
      if (lenis) lenis.start();
      flapItems.forEach((flap, idx) => {
        flap.style.transitionDelay = `${(flapItems.length - 1 - idx) * 20}ms`;
      });
      setTimeout(() => {
        menuOverlay.classList.remove("active");
      }, 500);
    }
  }

  toggleBtn.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   7. CARD SPOTLIGHT BORDER GLOW MATRIX
   ========================================================================== */
function initCardGlowMatrix() {
  const cards = document.querySelectorAll(".work-card-wrapper");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

/* ==========================================================================
   8. COPY TO CLIPBOARD MICRO-INTERACTION
   ========================================================================== */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll(".btn-copy-email");
  const emailText = "makvanapiyush4142@gmail.com";

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(emailText);
        btn.classList.add("copied");

        setTimeout(() => {
          btn.classList.remove("copied");
        }, 2400);
      } catch (err) {
        console.error("Failed to copy email:", err);
      }
    });
  });
}

/* ==========================================================================
   9. ACCORDION FAQS
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const body = item.querySelector(".faq-body");
    const inner = item.querySelector(".faq-body-inner");

    if (!trigger || !body || !inner) return;

    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items
      items.forEach((other) => {
        if (other !== item && other.classList.contains("active")) {
          other.classList.remove("active");
          const otherBody = other.querySelector(".faq-body");
          if (otherBody) otherBody.style.height = "0px";
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
        body.style.height = "0px";
      } else {
        item.classList.add("active");
        body.style.height = `${inner.offsetHeight}px`;
      }
    });
  });
}

/* ==========================================================================
   10. SCROLL TRIGGER & REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".about-card, .work-card-wrapper, .service-card, .why-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
  });

  // Handle in-view style
  const style = document.createElement("style");
  style.textContent = `
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}
