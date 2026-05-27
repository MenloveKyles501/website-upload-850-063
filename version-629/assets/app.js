(function () {
    var ready = function (fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    };

    ready(function () {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.classList.add("is-hidden");
            });
        });

        var menuButton = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        if (menuButton && menu) {
            menuButton.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-slide-dot]"));
            var current = 0;
            var show = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                });
            });
            if (slides.length > 1) {
                window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var searchInput = document.querySelector("[data-search-input]");
        var genreSelect = document.querySelector("[data-filter-genre]");
        var resetButton = document.querySelector("[data-filter-reset]");
        var applyFilters = function () {
            var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var genre = genreSelect ? genreSelect.value.trim() : "";
            cards.forEach(function (card) {
                var text = card.getAttribute("data-search") || "";
                var cardGenre = card.getAttribute("data-genre") || "";
                var matchText = !q || text.indexOf(q) !== -1;
                var matchGenre = !genre || cardGenre.indexOf(genre) !== -1;
                card.classList.toggle("is-hidden", !(matchText && matchGenre));
            });
        };
        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }
        if (genreSelect) {
            genreSelect.addEventListener("change", applyFilters);
        }
        if (resetButton) {
            resetButton.addEventListener("click", function () {
                if (searchInput) {
                    searchInput.value = "";
                }
                if (genreSelect) {
                    genreSelect.value = "";
                }
                applyFilters();
            });
        }

        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video[data-stream]");
            var button = player.querySelector("[data-play-action]");
            if (!video) {
                return;
            }
            var stream = video.getAttribute("data-stream");
            var init = function () {
                if (player.getAttribute("data-ready") === "1") {
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ maxBufferLength: 40 });
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
                        hls.loadSource(stream);
                    });
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    player._hls = hls;
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else {
                    video.src = stream;
                }
                player.setAttribute("data-ready", "1");
            };
            var play = function () {
                init();
                if (video.paused) {
                    video.play().catch(function () {});
                }
                player.classList.add("is-playing");
            };
            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    play();
                });
            }
            player.addEventListener("click", function (event) {
                if (event.target === video) {
                    return;
                }
                play();
            });
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    player.classList.remove("is-playing");
                }
            });
        });
    });
})();
