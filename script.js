/* ===================================
   PORTFOLIO JAVASCRIPT
   === REVISED & BUG-FREE ===
   =================================== */

'use strict';

// ===================================
// DOM ELEMENTS
// ===================================

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// ===================================
// MOBILE MENU TOGGLE
// ===================================

/**
 * Toggle mobile menu visibility
 */
function toggleMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

/**
 * Close mobile menu
 */
function closeMenu() {
  if (navLinks) {
    navLinks.classList.remove('active');
  }
}

// Event listeners for menu
if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

navItems.forEach(item => {
  item.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', event => {
  const isMenuToggle = event.target.closest('.menu-toggle');
  const isNavLinks = event.target.closest('.nav-links');

  if (!isMenuToggle && !isNavLinks && navLinks?.classList.contains('active')) {
    closeMenu();
  }
});

// ===================================
// SMOOTH SCROLL NAVIGATION
// ===================================

navItems.forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');

    if (href && href.startsWith('#')) {
      event.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.skill-card, .project-card, section').forEach(el => {
  if (el.id !== 'home') {
    observer.observe(el);
  }
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

window.addEventListener('scroll', () => {
  let current = '';

  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// ===================================
// NOTIFICATIONS
// ===================================

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', or 'info'
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');

  const bgColor = {
    success: '#4caf50',
    error: '#f44336',
    info: '#2196f3'
  }[type] || '#2196f3';

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${bgColor};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-weight: 500;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ===================================
// COPY TO CLIPBOARD
// ===================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Copied to clipboard!', 'success');
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy', 'error');
    });
}

// Add copy functionality to elements
document.querySelectorAll('[data-copy]').forEach(element => {
  element.style.cursor = 'pointer';
  element.addEventListener('click', () => {
    const text = element.getAttribute('data-copy');
    if (text) {
      copyToClipboard(text);
    }
  });
});

// ===================================
// FORM HANDLING
// ===================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    // Send to server (replace with your endpoint)
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to send message', 'error');
      });
  });
}

// ===================================
// LAZY LOAD IMAGES
// ===================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===================================
// DARK MODE TOGGLE
// ===================================

function toggleDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const root = document.documentElement;

  if (isDarkMode) {
    root.style.setProperty('--primary-color', '#000000');
    root.style.setProperty('--secondary-color', '#ffffff');
    root.style.setProperty('--accent-color', '#666666');
    root.style.setProperty('--light-gray', '#f5f5f5');
    localStorage.setItem('darkMode', 'false');
  } else {
    root.style.setProperty('--primary-color', '#ffffff');
    root.style.setProperty('--secondary-color', '#000000');
    root.style.setProperty('--accent-color', '#999999');
    root.style.setProperty('--light-gray', '#1a1a1a');
    localStorage.setItem('darkMode', 'true');
  }
}

const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

// ===================================
// PAGE LOAD
// ===================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  console.log('%c✓ Portfolio loaded successfully!', 'color: #4caf50; font-weight: bold;');
});

// ===================================
// ANALYTICS TRACKING
// ===================================

function trackEvent(eventName, eventData = {}) {
  if (window.umami) {
    window.umami.track(eventName, eventData);
  }
}

document.querySelectorAll('.btn, a').forEach(element => {
  element.addEventListener('click', () => {
    trackEvent('link_click', {
      text: element.textContent.trim(),
      href: element.href
    });
  });
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===================================
// CONSOLE MESSAGES
// ===================================

console.log('%cLRK Portfolio', 'font-size: 20px; font-weight: bold; color: #000;');
console.log('%cBuilt with HTML5, CSS3 & JavaScript', 'font-size: 14px; color: #666;');
console.log('%cMinimalist Design | Responsive | Modern', 'font-size: 12px; color: #999;');
