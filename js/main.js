/**
 * SKYNROOT Main Application Logic
 * UI Rendering, Filters, Ritual Builder, Navigation, GSAP Transitions, 3D Init
 */

import { PRODUCTS, INGREDIENTS_DATA, RITUAL_STEPS } from './products.js';
import { SkynrootHeroExperience } from './three-hero.js';

class SkynrootApp {
  constructor() {
    this.activeFilter = 'all';
    this.activeSort = 'featured';
    this.activeRitualStep = 0;

    this.init();
  }

  init() {
    this.initNavbar();
    this.initProductsGrid();
    this.initIngredientsSection();
    this.initRitualBuilder();
    this.init3DHero();
    this.initScrollAnimations();
    this.initSmoothScroll();
    this.initMobileMenu();
    this.initCheckoutModalEvents();
  }

  // ================= NAVBAR & SCROLL BEHAVIOR =================
  initNavbar() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ================= PRODUCTS CATALOG & FILTERING =================
  initProductsGrid() {
    this.productGrid = document.getElementById('products-grid');
    this.filterButtons = document.querySelectorAll('.filter-tab-btn');
    this.sortSelect = document.getElementById('product-sort-select');

    if (!this.productGrid) return;

    // Filter Buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter');
        this.renderProducts();
      });
    });

    // Sort Select
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.renderProducts();
      });
    }

    this.renderProducts();
  }

  renderProducts() {
    if (!this.productGrid) return;

    let items = [...PRODUCTS];

    // Filter
    if (this.activeFilter !== 'all') {
      items = items.filter(p => p.categorySlug === this.activeFilter);
    }

    // Sort
    if (this.activeSort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (this.activeSort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (this.activeSort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.productGrid.innerHTML = items.map(product => {
      const isWishlisted = window.skynroot && window.skynroot.wishlist.includes(product.id);
      return `
        <article class="product-card" data-tilt data-id="${product.id}">
          <div class="product-card-media" onclick="window.skynroot.openProductModal('${product.id}')">
            <span class="product-badge">${product.badge}</span>
            <div class="product-card-brand-tag">
              <span class="brand-letters">SKY<em class="script-n">n</em>ROOT</span>
              <span class="sub-skincare">SKINCARE</span>
            </div>
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    data-wishlist-id="${product.id}"
                    onclick="event.stopPropagation(); window.skynroot.toggleWishlist('${product.id}');"
                    title="Add to Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div class="product-image-wrap">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
            </div>
            <div class="product-card-overlay">
              <span class="overlay-quickview">Quick View ✦</span>
            </div>
          </div>

          <div class="product-card-body">
            <div class="product-card-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-size">${product.size}</span>
            </div>
            <h3 class="product-name" onclick="window.skynroot.openProductModal('${product.id}')">
              <span class="brand-inline">SKY<em class="script-n">n</em>ROOT</span> ${product.name}
            </h3>
            <p class="product-tagline">${product.tagline}</p>
            
            <div class="product-card-footer">
              <div class="product-price-wrap">
                <span class="price-val">₹${product.price.toLocaleString('en-IN')}</span>
              </div>
              <div class="product-buttons">
                <button class="btn btn-sm btn-outline" onclick="window.skynroot.openProductModal('${product.id}')">DETAILS</button>
                <button class="btn btn-sm btn-primary" onclick="window.skynroot.addToCart('${product.id}')">ADD TO BAG</button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.initCardTilt();
  }

  initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.product-card[data-tilt]');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ================= INGREDIENTS SECTION =================
  initIngredientsSection() {
    const container = document.getElementById('ingredients-grid');
    if (!container) return;

    container.innerHTML = INGREDIENTS_DATA.map((ing, i) => `
      <div class="ingredient-card" style="--accent: ${ing.color};">
        <div class="ingredient-card-header">
          <span class="ingredient-num">0${i + 1}</span>
          <span class="ingredient-role">${ing.role}</span>
        </div>
        <h3 class="ingredient-name">${ing.name}</h3>
        <em class="ingredient-botanical">${ing.botanical}</em>
        <p class="ingredient-desc">${ing.description}</p>
        <div class="ingredient-origin">
          <span class="origin-icon">🌿</span>
          <span>Origin: ${ing.origin}</span>
        </div>
      </div>
    `).join('');
  }

  // ================= 5-STEP RITUAL BUILDER =================
  initRitualBuilder() {
    this.ritualTabsContainer = document.getElementById('ritual-step-tabs');
    this.ritualDisplayContainer = document.getElementById('ritual-display');
    this.addWholeRitualBtn = document.getElementById('add-entire-ritual-btn');

    if (!this.ritualTabsContainer || !this.ritualDisplayContainer) return;

    // Render Steps Tabs
    this.ritualTabsContainer.innerHTML = RITUAL_STEPS.map((step, idx) => `
      <button class="ritual-step-tab ${idx === 0 ? 'active' : ''}" data-step-index="${idx}">
        <span class="step-num">${step.step}</span>
        <span class="step-phase">${step.phase}</span>
      </button>
    `).join('');

    this.renderRitualStep(0);

    // Event binding
    this.ritualTabsContainer.querySelectorAll('.ritual-step-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-step-index'));
        this.ritualTabsContainer.querySelectorAll('.ritual-step-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeRitualStep = idx;
        this.renderRitualStep(idx);
      });
    });

    if (this.addWholeRitualBtn) {
      this.addWholeRitualBtn.addEventListener('click', () => {
        // Add all 5 ritual products to the cart!
        RITUAL_STEPS.forEach(step => {
          if (window.skynroot) {
            window.skynroot.addToCart(step.productId, 1);
          }
        });
        if (window.skynroot) {
          window.skynroot.showToast('All 5 ritual formulation steps added to your bag!');
        }
      });
    }
  }

  renderRitualStep(idx) {
    const step = RITUAL_STEPS[idx];
    const product = PRODUCTS.find(p => p.id === step.productId);
    if (!step || !product) return;

    this.ritualDisplayContainer.innerHTML = `
      <div class="ritual-step-card animate-fade">
        <div class="ritual-card-left">
          <div class="ritual-pill-badge">${step.time}  •  ${step.duration}</div>
          <span class="ritual-stage-title">STEP ${step.step}: ${step.phase}</span>
          <h3 class="ritual-headline">${step.title}</h3>
          <p class="ritual-description">${step.description}</p>
          <div class="ritual-product-box">
            <div class="ritual-prod-thumb">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="ritual-prod-info">
              <span class="prod-badge">${product.category}</span>
              <h4 class="prod-title"><span class="brand-inline" style="color: var(--color-gold);">SKY<em class="script-n">n</em>ROOT</span> ${product.name}</h4>
              <span class="prod-price">₹${product.price.toLocaleString('en-IN')}</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="window.skynroot.addToCart('${product.id}')">ADD STEP</button>
          </div>
        </div>
        <div class="ritual-card-right">
          <div class="ritual-visual-frame">
            <div class="ritual-brand-seal">
              <span class="brand-letters">SKY<em class="script-n">n</em>ROOT</span>
              <span class="sub-skincare">SKINCARE</span>
            </div>
            <img src="${product.image}" alt="${product.name}" class="ritual-hero-img" />
            <div class="ritual-glow"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ================= 3D HERO INITIALIZATION =================
  init3DHero() {
    try {
      this.heroExperience = new SkynrootHeroExperience('hero-canvas-container');
    } catch (e) {
      console.warn('3D Hero init encountered an issue, fallback active:', e);
    }
  }

  // ================= GSAP SCROLL STORYTELLING =================
  initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.log('GSAP not loaded, relying on native CSS transitions.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Fade in story sections
    gsap.utils.toArray('.reveal-on-scroll').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: 'power3.out'
      });
    });

    // Story Section Parallax Images
    gsap.utils.toArray('.parallax-image').forEach(img => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: -30,
        ease: 'none'
      });
    });
  }

  // ================= SMOOTH SCROLLING =================
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
          }
        }
      });
    });
  }

  // ================= MOBILE MENU =================
  initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.classList.add('no-scroll');
      });
    }

    if (closeBtn && mobileMenu) {
      closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    }
  }

  // ================= CHECKOUT MODAL EVENTS =================
  initCheckoutModalEvents() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('[data-close-checkout]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    const form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.skynroot) {
          window.skynroot.completeMockCheckout();
        }
      });
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new SkynrootApp();
});
