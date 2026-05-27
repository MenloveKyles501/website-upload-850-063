(() => {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        const input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = 'search.html';
        }
      });
    });

    const hero = document.querySelector('[data-hero]');

    if (hero) {
      const slides = Array.from(hero.querySelectorAll('.hero-slide'));
      const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
      const thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
      const prev = hero.querySelector('[data-hero-prev]');
      const next = hero.querySelector('[data-hero-next]');
      let index = 0;
      let timer = null;

      const activate = (target) => {
        if (!slides.length) {
          return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach((slide, current) => {
          slide.classList.toggle('is-active', current === index);
        });
        dots.forEach((dot, current) => {
          dot.classList.toggle('is-active', current === index);
        });
        thumbs.forEach((thumb, current) => {
          thumb.classList.toggle('is-active', current === index);
        });
      };

      const restart = () => {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(() => activate(index + 1), 5200);
      };

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          activate(Number(dot.dataset.heroDot));
          restart();
        });
      });

      thumbs.forEach((thumb) => {
        thumb.addEventListener('mouseenter', () => {
          activate(Number(thumb.dataset.heroThumb));
          restart();
        });
      });

      if (prev) {
        prev.addEventListener('click', () => {
          activate(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener('click', () => {
          activate(index + 1);
          restart();
        });
      }

      activate(0);
      restart();
    }

    const panel = document.querySelector('[data-filter-panel]');
    const list = document.querySelector('[data-filter-list]');
    const emptyState = document.querySelector('[data-empty-state]');

    if (panel && list) {
      const queryInput = panel.querySelector('[data-filter-query]');
      const yearSelect = panel.querySelector('[data-filter-year]');
      const typeSelect = panel.querySelector('[data-filter-type]');
      const categorySelect = panel.querySelector('[data-filter-category]');
      const cards = Array.from(list.querySelectorAll('.movie-card'));
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('q') || '';
      const yearParam = params.get('year') || '';

      if (queryInput && queryParam) {
        queryInput.value = queryParam;
      }

      if (yearSelect && yearParam) {
        yearSelect.value = yearParam;
      }

      const normalize = (value) => String(value || '').trim().toLowerCase();

      const apply = () => {
        const keyword = normalize(queryInput ? queryInput.value : '');
        const year = normalize(yearSelect ? yearSelect.value : '');
        const type = normalize(typeSelect ? typeSelect.value : '');
        const category = normalize(categorySelect ? categorySelect.value : '');
        let visible = 0;

        cards.forEach((card) => {
          const haystack = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.category,
            card.dataset.tags
          ].join(' '));
          const matchedKeyword = !keyword || haystack.includes(keyword);
          const matchedYear = !year || normalize(card.dataset.year).includes(year);
          const matchedType = !type || normalize(card.dataset.type).includes(type);
          const matchedCategory = !category || normalize(card.dataset.category) === category;
          const matched = matchedKeyword && matchedYear && matchedType && matchedCategory;
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });

        if (emptyState) {
          emptyState.classList.toggle('is-visible', visible === 0);
        }
      };

      [queryInput, yearSelect, typeSelect, categorySelect].forEach((control) => {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    }
  });
})();
