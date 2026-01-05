/* ============================================
   GALLERY DATA
   ============================================ */

// Массив фотографий
const galleryImages = [
    // Жилые объекты (residential)
    { id: 1, src: 'assets/portfolio/residential/photo_9.jpg', category: 'residential', title: 'Установка розеток' },
    { id: 2, src: 'assets/portfolio/residential/photo_10.jpg', category: 'residential', title: 'Монтаж проводки' },

    // Коммерческие объекты (commercial)
    { id: 3, src: 'assets/portfolio/commercial/photo_1.jpg', category: 'commercial', title: 'Офисное освещение' },
    { id: 4, src: 'assets/portfolio/commercial/photo_2.jpg', category: 'commercial', title: 'Распределительный щит' },
    { id: 5, src: 'assets/portfolio/commercial/photo_3.jpg', category: 'commercial', title: 'Кабельные сети' },

    // Промышленные объекты (industrial)
    { id: 6, src: 'assets/portfolio/industrial/photo_4.jpg', category: 'industrial', title: 'Промышленное производство' },
    { id: 7, src: 'assets/portfolio/industrial/photo_5.jpg', category: 'industrial', title: 'Электрическое оборудование' },
    { id: 8, src: 'assets/portfolio/industrial/photo_6.jpg', category: 'industrial', title: 'Трансформатор' },

    // Уличные работы (outdoor)
    { id: 9, src: 'assets/portfolio/outdoor/photo_7.jpg', category: 'outdoor', title: 'Опоры ЛЭП' },
    { id: 10, src: 'assets/portfolio/outdoor/photo_8.jpg', category: 'outdoor', title: 'Уличное освещение' },
    { id: 11, src: 'assets/portfolio/outdoor/photo_13.jpg', category: 'outdoor', title: 'Столб электросети' },

    // Вентиляция (ventilation)
    { id: 12, src: 'assets/portfolio/ventilation/photo_11.jpg', category: 'ventilation', title: 'Система вентиляции' },
    { id: 13, src: 'assets/portfolio/ventilation/photo_12.jpg', category: 'ventilation', title: 'Воздухопровод' },
    { id: 14, src: 'assets/portfolio/ventilation/photo_14.jpg', category: 'ventilation', title: 'Монтаж вентиляции' },
    { id: 14, src: 'assets/portfolio/ventilation/photo_15.jpg', category: 'ventilation', title: 'Монтаж вентиляции' },
];


/* ============================================
PORTFOLIO
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('galleryGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!grid) return;

  const state = { filter: 'all', limit: 6 };
  let renderedCount = 0;

  function debounce(fn, ms = 120) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function applyMasonry() {
    const styles = getComputedStyle(grid);
    const rowHeight = parseInt(styles.getPropertyValue('grid-auto-rows'), 10) || 10;

    const gapStr = (styles.getPropertyValue('gap') || styles.getPropertyValue('grid-row-gap') || '0').trim();
    const rowGap = parseInt(gapStr.split(' ')[0], 10) || 0;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    grid.querySelectorAll('.gallery-item').forEach((item) => {
      const img = item.querySelector('img');
      if (!img || !img.complete || !img.naturalWidth) return;

      const ratio = img.naturalWidth / img.naturalHeight;
      const wide = isDesktop && ratio > 1.25;
      item.classList.toggle('is-wide', wide);

      const w2 = item.getBoundingClientRect().width;
      const targetHeight = Math.round(w2 / ratio);
      const span = Math.ceil((targetHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${span}`;
    });
  }

  const scheduleMasonry = debounce(() => {
    requestAnimationFrame(applyMasonry);
  }, 80);

  function filteredList() {
    return state.filter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === state.filter);
  }

  function appendItems(from, to) {
    const list = filteredList().slice(from, to);

    list.forEach((image, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.style.animationDelay = `${(from + i) * 50}ms`;

      item.innerHTML = `<img src="${image.src}" alt="${image.title}" loading="lazy">`;

      const imgEl = item.querySelector('img');
      imgEl.addEventListener('load', scheduleMasonry, { once: true });

      grid.appendChild(item);
    });
  }

  function render({ reset = false } = {}) {
    const all = filteredList();

    if (reset) {
      grid.innerHTML = '';
      renderedCount = 0;
    }

    const nextCount = Math.min(state.limit, all.length);
    if (nextCount > renderedCount) {
      appendItems(renderedCount, nextCount);
      renderedCount = nextCount;
    }

    if (loadMoreBtn) {
      const hasMore = renderedCount < all.length;
      loadMoreBtn.style.visibility = hasMore ? 'visible' : 'hidden';
      loadMoreBtn.disabled = !hasMore;
    }

    scheduleMasonry();
  }

  // Фильтры
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      state.filter = btn.dataset.filter || 'all';
      state.limit = 6;
      render({ reset: true });
    });
  });

  // Загрузить ещё (фиксируем позицию кнопки, чтобы экран не уезжал)
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const prevTop = loadMoreBtn.getBoundingClientRect().top;

      state.limit += 6;
      render({ reset: false });

      requestAnimationFrame(() => {
        const newTop = loadMoreBtn.getBoundingClientRect().top;
        window.scrollBy(0, newTop - prevTop);
      });
    });
  }

  window.addEventListener('resize', scheduleMasonry);

  render({ reset: true });
});


/* ============================================
   HEADER & NAVIGATION
   ============================================ */

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');

// Бургер-меню
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Закрыть меню при клике на ссылку
const navLinks = navMenu.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Скрыть меню при клике вне его
document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за элементами с анимацией
document.querySelectorAll('.animate-fade-up').forEach(el => {
    observer.observe(el);
});

/* ============================================
   SMOOTH SCROLL
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   CONTACT FORM
   ============================================ */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Валидация
        if (!name || !email || !phone || !message) {
            formStatus.textContent = '❌ Пожалуйста, заполните все поля';
            formStatus.className = 'form-status error';
            return;
        }

        // Email валидация
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formStatus.textContent = '❌ Пожалуйста, введите корректный email';
            formStatus.className = 'form-status error';
            return;
        }

        // Phone валидация
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            formStatus.textContent = '❌ Пожалуйста, введите корректный номер телефона';
            formStatus.className = 'form-status error';
            return;
        }

        try {
            // Отправка на Formspree
            const response = await fetch('https://formspree.io/f/meojrlde', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                })
            });

            if (response.ok) {
                formStatus.textContent = '✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.';
                formStatus.className = 'form-status success';
                contactForm.reset();
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            } else {
                formStatus.textContent = '❌ Ошибка отправки. Пожалуйста, попробуйте позже.';
                formStatus.className = 'form-status error';
            }
        } catch (error) {
            formStatus.textContent = '❌ Ошибка отправки. Пожалуйста, попробуйте позже.';
            formStatus.className = 'form-status error';
        }
    });
}

/* ============================================
   PAGE SCROLL ANIMATIONS
   ============================================ */

// Добавляем анимации при загрузке страницы
window.addEventListener('load', () => {
    document.querySelectorAll('.animate-fade-up').forEach((el, index) => {
        el.style.animationDelay = `${index * 50}ms`;
    });
});

/* ============================================
   HEADER SHADOW ON SCROLL
   ============================================ */

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 0) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

console.log('✅ Script loaded successfully!');
