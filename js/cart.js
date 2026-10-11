/**
 * SKYNROOT E-Commerce Engine & Interactive State
 * Cart, Wishlist, Search, Product Modal, and LocalStorage Persistence
 */

import { PRODUCTS, INGREDIENTS_DATA, RITUAL_STEPS } from './products.js';

class SkynrootStore {
  constructor() {
    this.cart = this.load('skynroot_cart', []);
    this.wishlist = this.load('skynroot_wishlist', []);
    this.appliedDiscount = this.load('skynroot_discount', null); // { code: 'NATURE10', rate: 0.1 }

    this.initElements();
    this.bindEvents();
    this.updateCartUI();
    this.updateWishlistUI();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  initElements() {
    // Badges & Counters
    this.cartCountBadges = document.querySelectorAll('.cart-count-badge');
    this.wishlistCountBadges = document.querySelectorAll('.wishlist-count-badge');

    // Drawers
    this.cartDrawer = document.getElementById('cart-drawer');
    this.cartOverlay = document.getElementById('cart-overlay');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.cartSubtotalEl = document.getElementById('cart-subtotal');
    this.cartShippingEl = document.getElementById('cart-shipping');
    this.cartDiscountRow = document.getElementById('cart-discount-row');
    this.cartDiscountAmount = document.getElementById('cart-discount-amount');
    this.cartTotalEl = document.getElementById('cart-total');
    this.freeShippingBar = document.getElementById('free-shipping-progress');
    this.freeShippingText = document.getElementById('free-shipping-text');

    // Wishlist Drawer
    this.wishlistDrawer = document.getElementById('wishlist-drawer');
    this.wishlistOverlay = document.getElementById('wishlist-overlay');
    this.wishlistItemsList = document.getElementById('wishlist-items-list');

    // Search Modal
    this.searchModal = document.getElementById('search-modal');
    this.searchInput = document.getElementById('site-search-input');
    this.searchResultsContainer = document.getElementById('search-results-list');

    // Product Detail Modal
    this.productModal = document.getElementById('product-detail-modal');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Open / Close Cart Drawer
    document.querySelectorAll('[data-open-cart]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    document.querySelectorAll('[data-close-cart]').forEach(el => {
      el.addEventListener('click', () => this.closeCart());
    });

    // Open / Close Wishlist
    document.querySelectorAll('[data-open-wishlist]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.openWishlist();
      });
    });

    document.querySelectorAll('[data-close-wishlist]').forEach(el => {
      el.addEventListener('click', () => this.closeWishlist());
    });

    // Open / Close Search
    document.querySelectorAll('[data-open-search]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    });

    document.querySelectorAll('[data-close-search]').forEach(el => {
      el.addEventListener('click', () => this.closeSearch());
    });

    // Search input typing
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Promo code apply button
    const promoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-code-input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'NATURE10' || code === 'SKYN10') {
          this.appliedDiscount = { code, rate: 0.1 };
          this.save('skynroot_discount', this.appliedDiscount);
          this.showToast('10% Luxury Welcome Discount Applied!');
          this.updateCartUI();
        } else if (code) {
          this.showToast('Invalid code. Try code: NATURE10');
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-action-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showToast('Your ritual bag is empty.');
          return;
        }
        this.openCheckoutModal();
      });
    }

    // Close product modal
    document.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => this.closeProductModal());
    });

    // Global ESC key to close open panels
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCart();
        this.closeWishlist();
        this.closeSearch();
        this.closeProductModal();
      }
    });
  }

  // ================= CART LOGIC =================
  addToCart(productId, quantity = 1, options = {}) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        size: options.size || product.size,
        image: product.image,
        quantity: quantity
      });
    }

    this.save('skynroot_cart', this.cart);
    this.updateCartUI();
    this.showToast(`Added ${product.name} to your ritual bag`);
    this.openCart();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.save('skynroot_cart', this.cart);
    this.updateCartUI();
    this.showToast('Item removed from your bag');
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.save('skynroot_cart', this.cart);
    this.updateCartUI();
  }

  updateCartUI() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    if (!this.cartItemsList) return;

    if (this.cart.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p class="empty-title">Your Ritual Bag is Empty</p>
          <p class="empty-desc">Discover our thoughtfully formulated botanical skincare collection.</p>
          <button class="btn btn-primary" onclick="window.skynroot.closeCart(); window.location.hash='#shop';">EXPLORE COLLECTION</button>
        </div>
      `;
    } else {
      this.cartItemsList.innerHTML = this.cart.map(item => `
        <div class="cart-item-card" data-id="${item.id}">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <span class="cart-item-category">${item.category}</span>
              <button class="cart-item-remove" onclick="window.skynroot.removeFromCart('${item.id}')" title="Remove Item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <h4 class="cart-item-title"><span class="brand-inline">SKY<em class="script-n">n</em>ROOT</span> ${item.name}</h4>
            <span class="cart-item-size">${item.size}</span>
            <div class="cart-item-footer">
              <div class="quantity-stepper">
                <button type="button" onclick="window.skynroot.updateQuantity('${item.id}', -1)">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="window.skynroot.updateQuantity('${item.id}', 1)">+</button>
              </div>
              <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Totals & Calculations (INR Currency)
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const freeShippingThreshold = 999.00;
    const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    if (this.freeShippingBar) {
      this.freeShippingBar.style.width = `${progressPercent}%`;
    }

    if (this.freeShippingText) {
      if (subtotal >= freeShippingThreshold) {
        this.freeShippingText.innerHTML = `🌿 <strong>Unlocked!</strong> Complimentary carbon-neutral express shipping across India`;
      } else {
        const remaining = (freeShippingThreshold - subtotal);
        this.freeShippingText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for complimentary carbon-neutral shipping`;
      }
    }

    let discountAmount = 0;
    if (this.appliedDiscount && subtotal > 0) {
      discountAmount = Math.round(subtotal * this.appliedDiscount.rate);
      if (this.cartDiscountRow) {
        this.cartDiscountRow.style.display = 'flex';
        this.cartDiscountAmount.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
      }
    } else if (this.cartDiscountRow) {
      this.cartDiscountRow.style.display = 'none';
    }

    const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99.00;
    const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

    if (this.cartSubtotalEl) this.cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (this.cartShippingEl) this.cartShippingEl.textContent = shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString('en-IN')}`;
    if (this.cartTotalEl) this.cartTotalEl.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
  }

  openCart() {
    if (this.cartDrawer) this.cartDrawer.classList.add('open');
    if (this.cartOverlay) this.cartOverlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  closeCart() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('open');
    if (this.cartOverlay) this.cartOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // ================= WISHLIST =================
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const product = PRODUCTS.find(p => p.id === productId);

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(`Removed from your wishlist`);
    } else {
      this.wishlist.push(productId);
      this.showToast(`Saved ${product ? product.name : ''} to wishlist`);
    }

    this.save('skynroot_wishlist', this.wishlist);
    this.updateWishlistUI();
    this.syncWishlistButtons();
  }

  updateWishlistUI() {
    const count = this.wishlist.length;
    this.wishlistCountBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    if (!this.wishlistItemsList) return;

    if (this.wishlist.length === 0) {
      this.wishlistItemsList.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">Your Wishlist is Empty</p>
          <p class="empty-desc">Heart your favorite natural formulations to revisit anytime.</p>
        </div>
      `;
    } else {
      const items = PRODUCTS.filter(p => this.wishlist.includes(p.id));
      this.wishlistItemsList.innerHTML = items.map(item => `
        <div class="cart-item-card">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <span class="cart-item-category">${item.category}</span>
            <h4 class="cart-item-title"><span class="brand-inline">SKY<em class="script-n">n</em>ROOT</span> ${item.name}</h4>
            <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
            <div class="wishlist-actions">
              <button class="btn btn-sm btn-primary" onclick="window.skynroot.addToCart('${item.id}')">ADD TO BAG</button>
              <button class="btn btn-sm btn-text" onclick="window.skynroot.toggleWishlist('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    this.syncWishlistButtons();
  }

  syncWishlistButtons() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      if (this.wishlist.includes(id)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  openWishlist() {
    if (this.wishlistDrawer) this.wishlistDrawer.classList.add('open');
    if (this.wishlistOverlay) this.wishlistOverlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  closeWishlist() {
    if (this.wishlistDrawer) this.wishlistDrawer.classList.remove('open');
    if (this.wishlistOverlay) this.wishlistOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // ================= LIVE SEARCH =================
  openSearch() {
    if (this.searchModal) this.searchModal.classList.add('open');
    if (this.searchInput) {
      this.searchInput.value = '';
      setTimeout(() => this.searchInput.focus(), 150);
      this.handleSearch('');
    }
    document.body.classList.add('no-scroll');
  }

  closeSearch() {
    if (this.searchModal) this.searchModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  handleSearch(query) {
    const q = query.trim().toLowerCase();
    if (!this.searchResultsContainer) return;

    let matches = PRODUCTS;
    if (q) {
      matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    if (matches.length === 0) {
      this.searchResultsContainer.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">No botanicals match "${query}"</p>
          <p class="empty-desc">Try searching for "serum", "charcoal", "aloe", or "sunscreen".</p>
        </div>
      `;
    } else {
      this.searchResultsContainer.innerHTML = matches.map(p => `
        <div class="search-result-card" onclick="window.skynroot.openProductModal('${p.id}'); window.skynroot.closeSearch();">
          <img src="${p.image}" alt="${p.name}" class="search-result-img" />
          <div class="search-result-info">
            <span class="search-category">${p.category}</span>
            <h4 class="search-title"><span class="brand-inline">SKY<em class="script-n">n</em>ROOT</span> ${p.name}</h4>
            <p class="search-desc">${p.tagline}</p>
          </div>
          <div class="search-result-price">
            <span>₹${p.price.toLocaleString('en-IN')}</span>
            <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.skynroot.addToCart('${p.id}');">ADD</button>
          </div>
        </div>
      `).join('');
    }
  }

  // ================= PRODUCT DETAIL MODAL =================
  openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !this.productModal) return;

    const modalBody = this.productModal.querySelector('.product-modal-content');
    if (!modalBody) return;

    const isWishlisted = this.wishlist.includes(product.id);

    modalBody.innerHTML = `
      <div class="modal-gallery">
        <div class="modal-main-image">
          <div class="modal-brand-tag">
            <span class="brand-letters">SKY<em class="script-n">n</em>ROOT</span>
            <span class="sub-skincare">SKINCARE</span>
          </div>
          <img src="${product.image}" alt="${product.name}" id="modal-image-preview" />
          <div class="badge-float">${product.badge}</div>
        </div>
        <div class="modal-thumbnails">
          <button class="thumb active"><img src="${product.image}" alt="View 1" /></button>
          <button class="thumb"><img src="assets/images/botanicals.png" alt="Ingredients" /></button>
          <button class="thumb"><img src="assets/images/hero-serum.png" alt="Aesthetic" /></button>
        </div>
      </div>

      <div class="modal-info">
        <div class="modal-header">
          <span class="modal-category">${product.category}  •  ${product.size}</span>
          <h2 class="modal-title"><span class="brand-inline">SKY<em class="script-n">n</em>ROOT</span> ${product.name}</h2>
          <div class="modal-rating">
            <div class="stars">★★★★★</div>
            <span class="rating-text">${product.rating} (${product.reviewsCount} verified reviews)</span>
          </div>
          <div class="modal-price">₹${product.price.toLocaleString('en-IN')}</div>
        </div>

        <p class="modal-tagline">${product.tagline}</p>
        <p class="modal-desc">${product.description}</p>

        <div class="modal-key-benefit">
          <div class="benefit-icon">✦</div>
          <div>
            <strong>Core Botanical Benefit:</strong>
            <p>${product.keyBenefit}</p>
          </div>
        </div>

        <div class="modal-configurator">
          <div class="config-row">
            <label>Volume:</label>
            <div class="size-options">
              <button class="size-pill active">${product.size}</button>
              <button class="size-pill">Luxury Duo (Save 15%)</button>
            </div>
          </div>
          <div class="config-row">
            <label>Quantity:</label>
            <div class="quantity-stepper large">
              <button type="button" id="modal-qty-minus">−</button>
              <span id="modal-qty-val">1</span>
              <button type="button" id="modal-qty-plus">+</button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-primary btn-large flex-1" id="modal-add-to-cart-btn">
            ADD TO RITUAL BAG • ₹${product.price.toLocaleString('en-IN')}
          </button>
          <button class="btn btn-icon ${isWishlisted ? 'active' : ''}" id="modal-wishlist-toggle" title="Save to wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <!-- Accordions -->
        <div class="modal-accordions">
          <details open>
            <summary>
              <span>The Ritual & Application</span>
              <span class="chevron">+</span>
            </summary>
            <div class="details-content">
              <p>${product.ritual}</p>
            </div>
          </details>

          <details>
            <summary>
              <span>Conscious Ingredients</span>
              <span class="chevron">+</span>
            </summary>
            <div class="details-content">
              <ul class="ingredients-list">
                ${product.ingredients.map(ing => `<li>• ${ing}</li>`).join('')}
              </ul>
              <small class="verified-note">✓ Verified botanical purity. Free of synthetic sulfates, parabens, and artificial fragrances.</small>
            </div>
          </details>

          <details>
            <summary>
              <span>Glass Packaging & Circularity</span>
              <span class="chevron">+</span>
            </summary>
            <div class="details-content">
              <p>${product.packaging}</p>
              <p>Shipped in 100% biodegradable FSC-certified paper with water-activated ink.</p>
            </div>
          </details>
        </div>
      </div>
    `;

    // Modal Events
    let qty = 1;
    const qtyVal = modalBody.querySelector('#modal-qty-val');
    const minusBtn = modalBody.querySelector('#modal-qty-minus');
    const plusBtn = modalBody.querySelector('#modal-qty-plus');
    const addBtn = modalBody.querySelector('#modal-add-to-cart-btn');
    const wishBtn = modalBody.querySelector('#modal-wishlist-toggle');

    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
        addBtn.innerHTML = `ADD TO RITUAL BAG • ₹${(product.price * qty).toLocaleString('en-IN')}`;
      }
    });

    plusBtn.addEventListener('click', () => {
      qty++;
      qtyVal.textContent = qty;
      addBtn.innerHTML = `ADD TO RITUAL BAG • ₹${(product.price * qty).toLocaleString('en-IN')}`;
    });

    addBtn.addEventListener('click', () => {
      this.addToCart(product.id, qty);
      this.closeProductModal();
    });

    wishBtn.addEventListener('click', () => {
      this.toggleWishlist(product.id);
      const active = this.wishlist.includes(product.id);
      wishBtn.classList.toggle('active', active);
      const svg = wishBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    });

    this.productModal.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  closeProductModal() {
    if (this.productModal) this.productModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // ================= CHECKOUT MODAL =================
  openCheckoutModal() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = this.appliedDiscount ? Math.round(subtotal * this.appliedDiscount.rate) : 0;
    const shipping = subtotal >= 999 ? 0 : 99.00;
    const total = subtotal - discount + shipping;

    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    modal.querySelector('#checkout-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    modal.querySelector('#checkout-shipping').textContent = shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString('en-IN')}`;
    modal.querySelector('#checkout-total').textContent = `₹${total.toLocaleString('en-IN')}`;

    modal.classList.add('open');
    this.closeCart();
  }

  completeMockCheckout() {
    this.cart = [];
    this.save('skynroot_cart', this.cart);
    this.updateCartUI();

    const checkoutContent = document.getElementById('checkout-modal-content');
    if (checkoutContent) {
      checkoutContent.innerHTML = `
        <div class="checkout-success">
          <div class="success-icon">✦</div>
          <h2 class="success-title">Order Received with Gratitude</h2>
          <p class="success-order-num">Confirmation #SR-${Math.floor(100000 + Math.random() * 900000)}</p>
          <p class="success-desc">Your order is being hand-packaged with fresh botanical samples in our solar-powered apothecary. A confirmation receipt has been simulated.</p>
          <button class="btn btn-primary" onclick="document.getElementById('checkout-modal').classList.remove('open');">RETURN TO BOUTIQUE</button>
        </div>
      `;
    }
  }

  // ================= TOAST NOTIFICATIONS =================
  showToast(message) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'luxury-toast';
    toast.innerHTML = `
      <span class="toast-dot"></span>
      <span class="toast-message">${message}</span>
    `;
    this.toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.skynroot = new SkynrootStore();
});
