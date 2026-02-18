const menuBtn = document.querySelector('.menu-btn');
const siteNav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');
const scrollProgress = document.querySelector('.scroll-progress');
const cursorGlow = document.querySelector('.cursor-glow');

if (menuBtn && siteNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (!siteNav.contains(target) && !menuBtn.contains(target)) {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = contactForm.querySelector('.form-status');
    if (status) {
      status.textContent = 'Благодарим! Получихме съобщението ви.';
    }
    contactForm.reset();
  });
}

const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 8);

    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;
      scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

if (cursorGlow && !window.matchMedia('(max-width: 900px)').matches) {
  document.body.classList.add('cursor-ready');
  window.addEventListener(
    'pointermove',
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];
const sectionIds = navLinks
  .map((link) => link.getAttribute('href'))
  .filter((href) => href && href.startsWith('#'));
const sections = sectionIds
  .map((id) => document.querySelector(id))
  .filter((section) => section instanceof HTMLElement);

if ('IntersectionObserver' in window && navLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === id;
          link.classList.toggle('active', isActive);
        });
      });
    },
    { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const tiltCards = document.querySelectorAll('.tilt');
tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    const rotateY = (relX - 0.5) * 8;
    const rotateX = (0.5 - relY) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
});

const magneticButtons = document.querySelectorAll('.btn, .filter-btn');
magneticButtons.forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  button.addEventListener('pointerleave', () => {
    button.style.transform = '';
  });
});

const orbOne = document.querySelector('.orb-1');
const orbTwo = document.querySelector('.orb-2');
const orbThree = document.querySelector('.orb-3');

const updateParallaxOrbs = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const y = window.scrollY;
  if (orbOne) {
    orbOne.style.transform = `translate3d(0, ${y * -0.04}px, 0)`;
  }
  if (orbTwo) {
    orbTwo.style.transform = `translate3d(0, ${y * -0.02}px, 0)`;
  }
  if (orbThree) {
    orbThree.style.transform = `translate3d(0, ${y * -0.05}px, 0)`;
  }
};

window.addEventListener('scroll', updateParallaxOrbs, { passive: true });
updateParallaxOrbs();

const quotes = Array.from(document.querySelectorAll('#quote-slider .quote'));
if (quotes.length > 1) {
  let quoteIndex = 0;
  let quoteTimer = null;

  const showQuote = (index) => {
    quotes.forEach((quote, i) => {
      quote.classList.toggle('active', i === index);
    });
  };

  const startQuoteRotation = () => {
    window.clearInterval(quoteTimer);
    quoteTimer = window.setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuote(quoteIndex);
    }, 4200);
  };

  showQuote(quoteIndex);
  startQuoteRotation();

  const quoteSlider = document.getElementById('quote-slider');
  if (quoteSlider) {
    quoteSlider.addEventListener('mouseenter', () => window.clearInterval(quoteTimer));
    quoteSlider.addEventListener('mouseleave', startQuoteRotation);
  }
}

const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const productsCount = document.getElementById('products-count');
const productCards = Array.from(document.querySelectorAll('.product-card'));

const setProductsCount = (count) => {
  if (!productsCount) {
    return;
  }

  productsCount.textContent = `${count} ${count === 1 ? 'продукт' : 'продукта'}`;
};

const applyProductFilter = (filter) => {
  let visibleCount = 0;

  productCards.forEach((card) => {
    const category = card.dataset.category || 'all';
    const show = filter === 'all' || category === filter;
    card.classList.toggle('is-hidden', !show);
    if (show) {
      visibleCount += 1;
    }
  });

  setProductsCount(visibleCount);
};

if (filterButtons.length && productCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextFilter = button.dataset.filter || 'all';
      filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      applyProductFilter(nextFilter);
    });
  });

  applyProductFilter('all');
}

const productModal = document.getElementById('product-modal');
const productModalTitle = document.getElementById('product-modal-title');
const productModalDescription = document.getElementById('product-modal-description');
const productModalTag = document.getElementById('product-modal-tag');
const productModalClose = document.getElementById('product-modal-close');

const openProductModal = (card) => {
  if (!productModal || !productModalTitle || !productModalDescription || !productModalTag) {
    return;
  }

  productModalTitle.textContent = card.dataset.product || 'Product';
  productModalDescription.textContent = card.dataset.description || '';
  productModalTag.textContent = card.dataset.tag || 'Premium';
  productModal.classList.add('is-open');
  productModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeProductModal = () => {
  if (!productModal) {
    return;
  }

  productModal.classList.remove('is-open');
  productModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('.open-product').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    if (card) {
      openProductModal(card);
    }
  });
});

if (productModalClose) {
  productModalClose.addEventListener('click', closeProductModal);
}

if (productModal) {
  productModal.addEventListener('click', (event) => {
    if (event.target === productModal) {
      closeProductModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProductModal();
  }
});

const floatingContactBtn = document.getElementById('floating-contact-btn');
const floatingContactPanel = document.getElementById('floating-contact-panel');

if (floatingContactBtn && floatingContactPanel) {
  floatingContactBtn.addEventListener('click', () => {
    const isOpen = floatingContactPanel.hasAttribute('hidden');
    if (isOpen) {
      floatingContactPanel.removeAttribute('hidden');
    } else {
      floatingContactPanel.setAttribute('hidden', 'hidden');
    }
    floatingContactBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieKey = 'lovenutty_cookie_ok_v1';

if (cookieBanner && cookieAccept) {
  const accepted = window.localStorage.getItem(cookieKey) === 'yes';
  if (!accepted) {
    cookieBanner.removeAttribute('hidden');
  }

  cookieAccept.addEventListener('click', () => {
    window.localStorage.setItem(cookieKey, 'yes');
    cookieBanner.setAttribute('hidden', 'hidden');
  });
}

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 32, 300)}ms`;
});

if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}
