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
  a.addEventListener('click', (evt) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const target = $(href);
    if (!target) return;

    evt.preventDefault();

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
  document.addEventListener('click', (evt) => {
    if (!navMenu.classList.contains('active')) return;
    const isInsideMenu = navMenu.contains(evt.target);
    const isToggle = toggle.contains(evt.target);
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
   Portfolio data + render
   ========================================================= */
(() => {
  const grid = $('#galleryGrid');
  const loadMoreBtn = $('#loadMoreBtn');

  if (!grid || !loadMoreBtn) return;

  const works = [
    {
      id: 1,
      title: 'Компания Талспецстрой',
      category: 'commercial',
      client: 'Организация',
      place: 'Нягань',
      year: '2020-2025',
      description: 'Объекты: офисные здания, общежитие, столовая, база отдыха. На объектах выполнен полный комплекс электромонтажных работ от сборки ВРУ до установки электротехнических изделий общего назначения. Смонтированы системы автоматического управления приточно-вытяжной вентиляцией, выполнена настройка и пусконаладка.',
      image: 'assets/portfolio/01.png'
    },
    {
      id: 2,
      title: 'Отапливаемые автобусные остановки',
      category: 'outdoor',
      client: 'Бизнес‑клиент',
      place: 'Нягань',
      year: '2025',
      description: 'Объекты: 10 отапливаемых автобусных остановок. Выполнена прокладка кабельных линий от подстанций и уличных электрических щитов, в траншеях и с помощью установки горизонтального наклонного бурения. Выполнено подключение остановок и настройка систем автоматического включения освещения и отопительных приборов. Проведено полное восстановление объектов городского благоустройства в местах прокладки кабеля в траншее.',
      image: 'assets/portfolio/02.png'
    },
    {
      id: 3,
      title: 'Жилой комплекс в 10 микрорайоне',
      category: 'residential',
      client: 'Бизнес-клиент',
      place: 'Нягань',
      year: '2024-2025',
      description: 'Объекты: квартиры в многоквартирном доме. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/03.png'
    },
    {
      id: 4,
      title: 'Жилой комплекс в Приурале',
      category: 'residential',
      client: 'Бизнес-клиент',
      place: 'Нягань',
      year: '2022-2024',
      description: 'Объекты: квартиры в многоквартирном доме. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/04.png'
    },
    {
      id: 5,
      title: 'ГПЗ Няганьгазпереработка',
      category: 'commercial',
      client: 'Бизнес-клиент',
      place: 'ХМАО',
      year: '2024',
      description: 'Объект: столовая. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/05.png'
    },
    {
      id: 6,
      title: 'Жилой комплекс в Восточном микрорайоне',
      category: 'residential',
      client: 'Бизнес-клиент',
      place: 'Нягань',
      year: '2021-2024',
      description: 'Объект: многоквартирный дом. Выполнен полный комплекс электромонтажных работ. Сборка ВРУ с последующим подключением отходящих линий. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/06.png'
    },
    {
      id: 7,
      title: 'Уличное освещение в Восточном микрорайоне',
      category: 'outdoor',
      client: 'Бизнес‑клиент',
      place: 'Нягань',
      year: '2021-2024',
      description: 'Объект: внутридворовое уличное освещение. Выполнена прокладка кабеля в траншеях, смонтированы и установлены опоры со светодиодными фонарями. Выполнено подключение фонарей и настройка астрореле для автоматического управления освещением.',
      image: 'assets/portfolio/07.png'
    },
    {
      id: 8,
      title: 'Няганская ГРЭС',
      category: 'industrial',
      client: 'Промышленная компания',
      place: 'Нягань',
      year: '2021',
      description: 'Объекты: энергоблоки №1, №2, №3. Выполнен монтаж системы контроля и управления приточно‑вытяжной вентиляцией (шкафы автоматики, датчики/исполнительные механизмы). Прокладка, маркировка и подключение кабельных линий. Пусконаладка и интеграция сигналов/удалённого управления в АСУ ТП, через распределённые модули ввода‑вывода Siemens по промышленной сети.',
      image: 'assets/portfolio/08.png'
    },
    {
      id: 9,
      title: 'Няганская ГРЭС',
      category: 'industrial',
      client: 'Промышленная компания',
      place: 'Нягань',
      year: '2020-2021',
      description: 'Объекты: энергоблок №1 и административное здание. В административном здании выполнен монтаж системы контроля и управления приточно‑вытяжной вентиляцией. Прокладка, маркировка и подключение кабельных линий. Пусконаладка и интеграция сигналов/удалённого управления в АСУ ТП, через распределённые модули ввода‑вывода Siemens по промышленной сети. В цеху 1-го энергоблока реализована система контроля загазованности (установка газоанализаторов, подключение сигналов в шкафы автоматики, интеграция в АСУ ТП для оповещения и диспетчеризации). Также выполнено подключение насосного оборудования после реконструкции — силовые подключения от щитов и включение сигналов/управления в систему удалённого контроля.',
      image: 'assets/portfolio/09.png'
    },
    {
      id: 10,
      title: 'Няганская ГРЭС',
      category: 'industrial',
      client: 'Промышленная компания',
      place: 'Нягань',
      year: '2019',
      description: 'Объект: цех химводоочистки/водоподготовки. Выполнена модернизация узла реагентного хозяйства и КИПиА. Монтаж датчиков на ёмкостях серной кислоты и щёлочи (NaOH). Прокладка, маркировка и подключение кабельных линий в шкафы/щиты автоматики. Пусконаладка и интеграция сигналов/удалённого управления в АСУ ТП, через распределённые модули ввода‑вывода Siemens по промышленной сети.',
      image: 'assets/portfolio/10.png'
    },
    {
      id: 11,
      title: 'ЖК Звёздный в 3 микрорайоне',
      category: 'residential',
      client: 'Бизнес‑клиент',
      place: 'Нягань',
      year: '2019',
      description: 'Объекты: квартиры в многоквартирном доме. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/11.png'
    },
    {
      id: 12,
      title: 'Комплекс очисных сооружений',
      category: 'industrial',
      client: 'Промышленная компания',
      place: 'Нягань',
      year: '2017-2018',
      description: 'Объект: комплекс очисных сооружений. Выполнен электромонтаж в административных зданиях и производственных помещениях (освещение, розеточные сети, щиты освещения и силовые щиты). Выполнена проверка проектной документации по технологическому оборудованию и системам автоматизации, фиксация замечаний и передача проекта на доработку. Монтаж шкафов управления технологическими узлами после корректировки проекта, подключение исполнительных механизмов и датчиков. В цехах биологической очистки выполнен монтаж и пусконаладка системы приточно‑вытяжной вентиляции.',
      image: 'assets/portfolio/12.png'
    },
    {
      id: 13,
      title: 'Коттеджи в 7 микрорайоне',
      category: 'residential',
      client: 'Частный заказчик',
      place: 'Нягань',
      year: '2016',
      description: 'Объекты: частные коттеджи. Выполнено подключение щитов/автоматики, прокладка кабельных линий, расключение распаячных коробок, установка электротехнических изделий общего назначения, в соответствии с дизайнерской и проектной документацией.',
      image: 'assets/portfolio/13.png'
    },
    {
      id: 14,
      title: 'ТАЦ Европейский',
      category: 'commercial',
      client: 'Организация',
      place: 'Нягань',
      year: '2014',
      description: 'Объект: здание торгово-административного центра. Выполнена сборка и монтаж ВРУ с подключением отходящих линий. Выполнено подключение щитов/автоматики, прокладка кабельных линий, как в скрытом исполнении, так и в кабель-каналах, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/14.png'
    },
    {
      id: 15,
      title: 'ТЦ Союз',
      category: 'commercial',
      client: 'Организация',
      place: 'Нягань',
      year: '2013-2014',
      description: 'Объект: здание торгового центра. Выполнена сборка и монтаж ВРУ с подключением отходящих линий. Выполнено подключение щитов/автоматики, прокладка кабельных линий, как в скрытом исполнении, так и в кабель-каналах, расключение распаячных коробок, установка электротехнических изделий общего назначения.',
      image: 'assets/portfolio/15.png'
    },
  ];

  const INITIAL_VISIBLE = 4;
  const STEP = 4;
  let visibleCount = INITIAL_VISIBLE;
  let renderedCount = 0;

  function humanCategory(cat) {
    const map = {
      residential: 'Жилые',
      commercial: 'Коммерческие',
      industrial: 'Промышленные',
      outdoor: 'Наружные работы',
    };
    return map[cat] || cat;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
    const newItems = works.slice(renderedCount, visibleCount);

    newItems.forEach(w => grid.appendChild(createCard(w)));

    renderedCount = visibleCount;

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
   Contact form (Formspree)
   ========================================================= */
(() => {
  const form = $('#contactForm');
  const statusEl = $('#formStatus');
  const submitBtn = $('#submitBtn');
  const agreementEl = $('#agreement');

  if (!form || !statusEl) return;

  const ACCESS_KEY = '9708b224-60a7-4b48-82dd-eda812ff216d';
  const DEFAULT_ENDPOINT = 'https://api.web3forms.com/submit';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{5,}$/;

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = `form-status ${type || ''}`.trim();
  }

  agreementEl?.addEventListener('change', () => {
    if (agreementEl.checked) {
      setStatus('', '');
    }
  });

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

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

    const agreed = !!agreementEl?.checked;
    if (!agreed) {
      setStatus('❌ Пожалуйста, подтвердите согласие на обработку персональных данных', 'error');
      return;
    }

    if (!fd.get('access_key')) fd.append('access_key', ACCESS_KEY);
    const endpoint = form.getAttribute('action') || DEFAULT_ENDPOINT;

    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Отправка...', '');

      const res = await fetch(endpoint, { method: 'POST', body: fd });
      let data = null;

      try {
        data = await res.json();
      } catch (_) { }

      if (res.ok && data?.success !== false) {
        setStatus('✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        setTimeout(() => setStatus('', ''), 5000);
      } else {
        const msg = data?.message ? `❌ ${data.message}` : '❌ Ошибка отправки. Пожалуйста, попробуйте позже.';
        setStatus(msg, 'error');
      }
    } catch (err) {
      setStatus('❌ Ошибка отправки. Проверьте интернет/настройки браузера и попробуйте ещё раз.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
