(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    if (menuButton) {
      menuButton.addEventListener('click', function () {
        document.body.classList.toggle('is-menu-open');
      });
    }

    document.querySelectorAll('[data-quick-search]').forEach(function (box) {
      var input = box.querySelector('input');
      var button = box.querySelector('button');
      var go = function () {
        var value = input ? input.value.trim() : '';
        if (value) {
          window.location.href = './search.html?q=' + encodeURIComponent(value);
        } else {
          window.location.href = './search.html';
        }
      };
      if (button) {
        button.addEventListener('click', go);
      }
      if (input) {
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            go();
          }
        });
      }
    });

    document.querySelectorAll('[data-filter-area]').forEach(function (area) {
      var input = area.querySelector('[data-filter-input]');
      var category = area.querySelector('[data-filter-category]');
      var year = area.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(area.querySelectorAll('[data-movie-card]'));
      var empty = area.querySelector('[data-empty]');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q') || '';

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function normalize(value) {
        return String(value || '').toLowerCase();
      }

      function apply() {
        var query = normalize(input ? input.value.trim() : '');
        var selectedCategory = category ? category.value : '';
        var selectedYear = year ? year.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var searchText = normalize(card.getAttribute('data-search'));
          var cardCategory = card.getAttribute('data-category') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var ok = true;

          if (query && searchText.indexOf(query) === -1) {
            ok = false;
          }

          if (selectedCategory && cardCategory !== selectedCategory) {
            ok = false;
          }

          if (selectedYear && cardYear !== selectedYear) {
            ok = false;
          }

          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      if (category) {
        category.addEventListener('change', apply);
      }

      if (year) {
        year.addEventListener('change', apply);
      }

      apply();
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var start = document.querySelector('[data-player-start]');
      var hlsInstance = null;

      function streamUrl() {
        return video ? video.getAttribute('data-stream') : '';
      }

      function attach() {
        if (!video || video.getAttribute('data-ready') === '1') {
          return;
        }

        var url = streamUrl();
        if (!url) {
          return;
        }

        video.setAttribute('data-ready', '1');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
          return;
        }

        video.src = url;
      }

      function play() {
        if (!video) {
          return;
        }

        attach();
        player.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener('click', play);
      }

      if (start) {
        start.addEventListener('click', play);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            play();
          }
        });
      }

      window.addEventListener('pagehide', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
