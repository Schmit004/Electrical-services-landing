/* =========================================================
   UI helpers
   ========================================================= */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setHeaderShadow() {
  const header = $('#header');
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 4);
}

/* =========================================================
   Smooth scroll (anchors)
   ========================================================= */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const target = $(href);
    if (!target) return;

    e.preventDefault();

    // close mobile menu if open
    const navMenu = $('#navMenu');
    const menuToggle = $('#menuToggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================================
   Mobile menu toggle
   ========================================================= */
(() => {
  const toggle = $('#menuToggle');
  const navMenu = $('#navMenu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    const next = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', next);
    toggle.classList.toggle('is-open', next);
    toggle.setAttribute('aria-expanded', String(next));
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('active')) return;
    const isInsideMenu = navMenu.contains(e.target);
    const isToggle = toggle.contains(e.target);
    if (!isInsideMenu && !isToggle) {
      navMenu.classList.remove('active');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* =========================================================
   Reveal on scroll (IntersectionObserver)
   ========================================================= */
(() => {
  const items = $$('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('is-visible');
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

/* =========================================================
   Header shadow on scroll
   ========================================================= */
window.addEventListener('scroll', setHeaderShadow);
window.addEventListener('load', setHeaderShadow);

/* =========================================================
   Portfolio data + render (NO FILTERS)
   - Shows 4 by default
   - Load more by button
   ========================================================= */
(() => {
  const grid = $('#galleryGrid');
  const loadMoreBtn = $('#loadMoreBtn');

  if (!grid || !loadMoreBtn) return;

  // Подстрой пути/описания под реальные проекты при необходимости
  const works = [
    {
      id: 1,
      title: 'Электромонтаж в жилом помещении',
      category: 'residential',
      client: 'Частный заказчик',
      place: 'Нягань',
      year: '2024',
      description: 'Разводка линий, щит, розеточные группы, освещение. Аккуратная прокладка и маркировка.',
      image: 'assets/portfolio/01.jpg'
    },
    {
      id: 2,
      title: 'Коммерческий объект: офис/магазин',
      category: 'commercial',
      client: 'Бизнес‑клиент',
      place: 'Нягань',
      year: '2023',
      description: 'Силовые линии, освещение, согласование решений под эксплуатационные требования.',
      image: 'assets/portfolio/02.jpg'
    },
    {
      id: 3,
      title: 'Промышленный участок',
      category: 'industrial',
      client: 'Промышленная компания',
      place: 'ХМАО',
      year: '2022',
      description: 'Монтаж линий, подключение оборудования, соблюдение требований безопасности.',
      image: 'assets/portfolio/03.jpg'
    },
    {
      id: 4,
      title: 'Уличное освещение территории',
      category: 'outdoor',
      client: 'Организация',
      place: 'ХМАО',
      year: '2023',
      description: 'Опоры, кабельные трассы, подключение светильников, проверка работоспособности.',
      image: 'assets/portfolio/04.jpg'
    },
    {
      id: 5,
      title: 'Вентиляция и климат: электрика',
      category: 'ventilation',
      client: 'Коммерческий объект',
      place: 'Нягань',
      year: '2024',
      description: 'Подключение щитов/автоматики, питание оборудования, пусконаладка электрической части.',
      image: 'assets/portfolio/05.jpg'
    },
    {
      id: 6,
      title: 'Электроснабжение: модернизация щита',
      category: 'commercial',
      client: 'Бизнес‑клиент',
      place: 'Нягань',
      year: '2022',
      description: 'Перекоммутация, защита, оптимизация схемы и проверка нагрузок.',
      image: 'assets/portfolio/06.jpg'
    }
  ];

  const INITIAL_VISIBLE = 4;
  const STEP = 4;

  let visibleCount = INITIAL_VISIBLE;

  function humanCategory(cat) {
    const map = {
      residential: 'Жилые',
      commercial: 'Коммерческие',
      industrial: 'Промышленные',
      outdoor: 'Уличное',
      ventilation: 'Вентиляция'
    };
    return map[cat] || cat;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function createCard(work) {
    const card = document.createElement('article');
    card.className = 'work-card';

    const media = document.createElement('div');
    media.className = 'work-media';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = work.title;
    img.src = work.image;

    img.addEventListener('error', () => {
      media.classList.add('is-fallback');
    });

    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'work-body';

    const title = document.createElement('h3');
    title.className = 'work-title';
    title.textContent = work.title;

    const meta = document.createElement('div');
    meta.className = 'work-meta';
    meta.innerHTML = `
      <span class="badge"><i class="fa-solid fa-tag"></i>${humanCategory(work.category)}</span>
      <span class="badge"><i class="fa-solid fa-handshake"></i>${escapeHtml(work.client)}</span>
      <span class="badge"><i class="fa-solid fa-location-dot"></i>${escapeHtml(work.place)}</span>
      <span class="badge"><i class="fa-solid fa-calendar"></i>${escapeHtml(work.year)}</span>
    `;

    const desc = document.createElement('p');
    desc.className = 'work-desc';
    desc.textContent = work.description;

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(desc);

    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  function render() {
    const slice = works.slice(0, visibleCount);
    grid.innerHTML = '';
    slice.forEach(w => grid.appendChild(createCard(w)));

    const hasMore = visibleCount < works.length;
    loadMoreBtn.style.display = hasMore ? '' : 'none';
  }

  loadMoreBtn.addEventListener('click', () => {
    visibleCount += STEP;
    render();
  });

  render();
})();

/* =========================================================
   Contact form (Formspree) - fixed + robust
   ========================================================= */
(() => {
  const form = $('#contactForm');
  const statusEl = $('#formStatus');
  const submitBtn = $('#submitBtn');

  if (!form || !statusEl) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{5,}$/;

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = `form-status ${type || ''}`.trim();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !phone || !email || !message) {
      setStatus('❌ Пожалуйста, заполните все поля', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      setStatus('❌ Пожалуйста, введите корректный email', 'error');
      return;
    }
    if (!phoneRegex.test(phone)) {
      setStatus('❌ Пожалуйста, введите корректный номер телефона', 'error');
      return;
    }

    const endpoint = form.getAttribute('action') || 'https://formspree.io/f/meojrlde';

    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Отправка...', '');

      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setStatus('✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        setTimeout(() => setStatus('', ''), 6000);
      } else {
        setStatus('❌ Ошибка отправки. Пожалуйста, попробуйте позже.', 'error');
      }
    } catch (err) {
      setStatus('❌ Ошибка отправки. Проверьте интернет/настройки браузера и попробуйте ещё раз.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
