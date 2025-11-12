/* ============================================
   COURSE SITE - JAVASCRIPT UTILITIES
   ============================================ */

// ========== DOM UTILITIES ==========

const DOM = {
  /**
   * Select single element
   */
  get(selector) {
    return document.querySelector(selector);
  },

  /**
   * Select multiple elements
   */
  getAll(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Create element with attributes and classes
   */
  create(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.class) {
      if (typeof options.class === 'string') {
        element.className = options.class;
      } else if (Array.isArray(options.class)) {
        element.classList.add(...options.class);
      }
    }
    
    if (options.text) {
      element.textContent = options.text;
    }
    
    if (options.html) {
      element.innerHTML = options.html;
    }
    
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    return element;
  },

  /**
   * Add class to element
   */
  addClass(selector, className) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    if (element) element.classList.add(className);
  },

  /**
   * Remove class from element
   */
  removeClass(selector, className) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    if (element) element.classList.remove(className);
  },

  /**
   * Toggle class on element
   */
  toggleClass(selector, className) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    if (element) element.classList.toggle(className);
  },

  /**
   * Check if element has class
   */
  hasClass(selector, className) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Set multiple attributes
   */
  setAttrs(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },

  /**
   * Add event listener
   */
  on(selector, event, handler) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    if (element) element.addEventListener(event, handler);
  },

  /**
   * Remove event listener
   */
  off(selector, event, handler) {
    const element = typeof selector === 'string' ? this.get(selector) : selector;
    if (element) element.removeEventListener(event, handler);
  },

  /**
   * Add event listener to all matching elements
   */
  onAll(selector, event, handler) {
    this.getAll(selector).forEach(element => {
      element.addEventListener(event, handler);
    });
  },
};

// ========== NAVIGATION ==========

const Navigation = {
  init() {
    const toggle = DOM.get('.nav-toggle');
    const nav = DOM.get('nav');
    
    if (!toggle || !nav) return false;
    
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      this.updateToggleIcon();
    });

    // Close menu when link clicked
    DOM.getAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        this.updateToggleIcon();
      });
    });

    // Close menu on window resize to large
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        nav.classList.remove('active');
        this.updateToggleIcon();
      }
    });
    
    return true;
  },

  updateToggleIcon() {
    const toggle = DOM.get('.nav-toggle');
    const nav = DOM.get('nav');
    
    if (!toggle || !nav) return;
    
    const isOpen = nav.classList.contains('active');
    const spans = toggle.querySelectorAll('span');
    
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  },

  setActive(path) {
    DOM.getAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || window.location.pathname.includes(href)) {
        DOM.addClass(link, 'active');
      } else {
        DOM.removeClass(link, 'active');
      }
    });
  }
};

// ========== SCROLLING & ANIMATIONS ==========

const Scroll = {
  /**
   * Smooth scroll to element
   */
  to(selector) {
    const element = typeof selector === 'string' ? DOM.get(selector) : selector;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  },

  /**
   * Observe elements for animations
   */
  observeElements(selector, options = {}) {
    const elements = DOM.getAll(selector);
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          DOM.addClass(entry.target, 'fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    elements.forEach(element => {
      observer.observe(element);
    });

    return observer;
  }
};

// ========== UTILITIES ==========

const Utils = {
  /**
   * Format number with comma separator
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Get URL parameters
   */
  getParams() {
    const params = new URLSearchParams(window.location.search);
    const obj = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  },

  /**
   * Set page title
   */
  setPageTitle(title) {
    document.title = title ? `${title} | Fast Track Course` : 'Fast Track Course';
  }
};

// ========== COLOR THEME ==========

const Theme = {
  /**
   * Change primary color (for tomato or other colors)
   */
  setPrimaryColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    
    // Calculate derived colors
    const darkened = this.shadeColor(color, -20);
    const lightened = this.shadeColor(color, 20);
    
    root.style.setProperty('--primary-dark', darkened);
    root.style.setProperty('--primary-light', lightened);
    
    // Save to localStorage
    localStorage.setItem('primaryColor', color);
  },

  /**
   * Shade/tint a color
   */
  shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  },

  /**
   * Load saved theme
   */
  loadTheme() {
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      this.setPrimaryColor(savedColor);
    }
  }
};

// ========== STORAGE ==========

const Storage = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  Theme.loadTheme();
  Scroll.observeElements('[data-animate]');
});
