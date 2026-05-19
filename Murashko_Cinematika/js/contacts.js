document.getElementById('contactSubmit').addEventListener('click', function () {
    const name  = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg   = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !msg) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    // Простая проверка email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
        alert('Введите корректный email!');
        return;
    }

    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    document.getElementById('contactName').value    = '';
    document.getElementById('contactEmail').value   = '';
    document.getElementById('contactMessage').value = '';
});
