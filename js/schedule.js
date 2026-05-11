/**
 * Кинотеатр «Cinematica» — script.js
 * Загрузка расписания из XML, модальные окна, кнопки выбора дня
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let xmlData = null;

    /* ---- Загрузка XML ---- */
    function loadData() {
        fetch('./xml/data.xml')
            .then(function (res) {
                if (!res.ok) throw new Error('Ошибка сети: ' + res.status);
                return res.text();
            })
            .then(function (str) {
                const parser = new DOMParser();
                xmlData = parser.parseFromString(str, 'text/xml');
                renderMovies('today');
            })
            .catch(function (e) {
                console.error('Ошибка загрузки data.xml:', e.message);
                const container = document.getElementById('movie-container');
                if (container) {
                    container.innerHTML = '<p style="color:#e53e3e;font-weight:600;">Не удалось загрузить расписание. Пожалуйста, обновите страницу.</p>';
                }
            });
    }

    /* ---- Отрисовка фильмов ---- */
    function renderMovies(day) {
        if (!xmlData) return;

        const container = document.getElementById('movie-container');
        if (!container) return;
        container.innerHTML = '';

        const movies = xmlData.getElementsByTagName('movie');
        let count = 0;

        for (let i = 0; i < movies.length; i++) {
            if (movies[i].getAttribute('day') !== day) continue;

            const title  = getText(movies[i], 'title');
            const genre  = getText(movies[i], 'genre');
            const desc   = getText(movies[i], 'desc');
            const img    = getText(movies[i], 'image');
            const times  = getText(movies[i], 'sessions').split(',').map(t => t.trim());

            const card = document.createElement('article');
            card.className = 'movie-card';
            card.setAttribute('role', 'listitem');

            const timeSlotsHTML = times.map(function (t) {
                return '<span>' + escapeHTML(t) + '</span>';
            }).join('');

            card.innerHTML = [
                '<div class="poster-area" tabindex="0" role="button"',
                '     aria-label="Подробнее о фильме ' + escapeAttr(title) + '"',
                '     data-title="' + escapeAttr(title) + '"',
                '     data-desc="'  + escapeAttr(desc)  + '"',
                '     data-genre="' + escapeAttr(genre) + '">',
                '  <img src="' + escapeAttr(img) + '" alt="Постер фильма ' + escapeAttr(title) + '" loading="lazy">',
                '  <div class="poster-overlay" aria-hidden="true">',
                '    <div class="poster-box">ИНФОРМАЦИЯ</div>',
                '  </div>',
                '</div>',
                '<div class="movie-details">',
                '  <h3 class="movie-title">' + escapeHTML(title) + '</h3>',
                '  <p class="movie-genre">'  + escapeHTML(genre) + '</p>',
                '  <div class="time-slots">' + timeSlotsHTML + '</div>',
                '  <button class="buy-button" data-title="' + escapeAttr(title) + '">КУПИТЬ БИЛЕТ</button>',
                '</div>',
            ].join('');

            container.appendChild(card);
            count++;
        }

        if (count === 0) {
            container.innerHTML = '<p style="color:#6b7a8d; grid-column:1/-1;">На выбранную дату фильмов нет.</p>';
        }
    }

    /* ---- Получение текста тега ---- */
    function getText(el, tag) {
        const found = el.getElementsByTagName(tag)[0];
        return found ? found.textContent : '';
    }

    /* ---- Экранирование HTML ---- */
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /* ---- Делегирование кликов по контейнеру ---- */
    const movieContainer = document.getElementById('movie-container');
    if (movieContainer) {
        movieContainer.addEventListener('click', function (e) {
            // Постер — инфо
            const poster = e.target.closest('.poster-area');
            if (poster) {
                showInfo(poster.dataset.title, poster.dataset.desc, poster.dataset.genre);
                return;
            }
            // Кнопка — билет
            const btn = e.target.closest('.buy-button');
            if (btn) {
                openTicket(btn.dataset.title);
            }
        });

        // Доступность: Enter на постере
        movieContainer.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const poster = e.target.closest('.poster-area');
                if (poster) {
                    e.preventDefault();
                    showInfo(poster.dataset.title, poster.dataset.desc, poster.dataset.genre);
                }
            }
        });
    }

    /* ---- Модалка: информация ---- */
    function showInfo(title, desc, genre) {
        document.getElementById('infoTitle').textContent = title;
        document.getElementById('infoDesc').textContent  = desc;
        document.getElementById('infoGenre').textContent = genre;
        openModal('infoModal');
    }

    /* ---- Модалка: покупка ---- */
    function openTicket(title) {
        document.getElementById('selectedMovie').textContent = 'Фильм: ' + title;
        document.getElementById('custName').value  = '';
        document.getElementById('custPhone').value = '';
        openModal('ticketModal');
    }

    /* ---- Открыть / закрыть модалку ---- */
    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'flex';
        // Фокус на кнопку закрытия
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    }

    /* ---- Кнопки закрытия ---- */
    const closeInfo   = document.getElementById('closeInfo');
    const closeTicket = document.getElementById('closeTicket');
    if (closeInfo)   closeInfo.addEventListener('click',   function () { closeModal('infoModal'); });
    if (closeTicket) closeTicket.addEventListener('click', function () { closeModal('ticketModal'); });

    /* ---- Закрытие по клику вне модалки ---- */
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });

    /* ---- Закрытие по Escape ---- */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(function (m) {
                m.style.display = 'none';
            });
        }
    });

    /* ---- Кнопки сегодня / завтра ---- */
    const btnToday    = document.getElementById('btn-today');
    const btnTomorrow = document.getElementById('btn-tomorrow');

    if (btnToday) {
        btnToday.addEventListener('click', function () {
            btnTomorrow && btnTomorrow.classList.remove('active');
            btnTomorrow && btnTomorrow.setAttribute('aria-pressed', 'false');
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            renderMovies('today');
        });
    }

    if (btnTomorrow) {
        btnTomorrow.addEventListener('click', function () {
            btnToday && btnToday.classList.remove('active');
            btnToday && btnToday.setAttribute('aria-pressed', 'false');
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            renderMovies('tomorrow');
        });
    }

    /* ---- Форма покупки ---- */
    const submitOrder = document.getElementById('submitOrder');
    if (submitOrder) {
        submitOrder.addEventListener('click', function () {
            const name  = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();

            if (!name || !phone) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }

            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModal('ticketModal');
        });
    }

    /* ---- Запуск ---- */
    loadData();
});
