let xmlDoc = null;

// 1. Загрузка данных
fetch('./xml/data.xml')
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(data, "text/xml");
        renderMovies('today'); // По умолчанию показываем фильмы на сегодня
    });

// 2. Функция отрисовки фильмов
function renderMovies(day) {
    let container = document.getElementById('movie-container');
    container.innerHTML = '';

    let movies = xmlDoc.getElementsByTagName('movie');

    for (let i = 0; i < movies.length; i++) {
        let movieDay = movies[i].getAttribute('day');

        // Если день совпадает, создаем карточку
        if (movieDay === day) {
            let title = movies[i].getElementsByTagName('title')[0].textContent;
            let genre = movies[i].getElementsByTagName('genre')[0].textContent;
            let desc = movies[i].getElementsByTagName('desc')[0].textContent;
            let img = movies[i].getElementsByTagName('image')[0].textContent;
            let sessions = movies[i].getElementsByTagName('sessions')[0].textContent;

            // Просто склеиваем HTML в строку
            let movieHTML = `
                <article class="movie-card">
                    <div class="poster-area" onclick="showInfo('${title}', '${genre}', '${desc}')">
                        <img src="${img}" alt="постер">
                        <div class="poster-overlay">
                            <div class="poster-box">ИНФОРМАЦИЯ</div>
                        </div>
                    </div>
                    <div class="movie-details">
                        <h3 class="movie-title">${title}</h3>
                        <p class="movie-genre">${genre}</p>
                        <div class="time-slots">
                            <span>${sessions.split(',').join('</span><span>')}</span>
                        </div>
                        <button class="buy-button" onclick="openTicket('${title}')">КУПИТЬ БИЛЕТ</button>
                    </div>
                </article>
            `;
            container.innerHTML += movieHTML;
        }
    }
}

// 3. Функции для модальных окон
function showInfo(title, genre, desc) {
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoGenre').textContent = genre;
    document.getElementById('infoDesc').textContent = desc;
    document.getElementById('infoModal').style.display = 'flex';
}

function openTicket(title) {
    document.getElementById('selectedMovie').textContent = 'Фильм: ' + title;
    document.getElementById('ticketModal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Закрытие модалок по крестику
document.getElementById('closeInfo').onclick = function() {
    closeModal('infoModal');
};

document.getElementById('closeTicket').onclick = function() {
    closeModal('ticketModal');
};

// Закрытие модалок по клику на фон
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
};

// 4. Кнопки переключения дней
document.getElementById('btn-today').onclick = function() {
    this.classList.add('active');
    document.getElementById('btn-tomorrow').classList.remove('active');
    renderMovies('today');
};

document.getElementById('btn-tomorrow').onclick = function() {
    this.classList.add('active');
    document.getElementById('btn-today').classList.remove('active');
    renderMovies('tomorrow');
};

// 5. Обработка формы
document.getElementById('submitOrder').onclick = function() {
    let name = document.getElementById('custName').value;
    let phone = document.getElementById('custPhone').value;

    if (name != '' && phone != '') {
        alert('Спасибо, ' + name + '! Заявка принята.');
        closeModal('ticketModal');
    } else {
        alert('Заполните поля!');
    }
};
