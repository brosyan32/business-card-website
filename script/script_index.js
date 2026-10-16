document.addEventListener('DOMContentLoaded', () => {
    // Модальные элементы
    const bookingModal = document.getElementById('bookingModal');
    const menuModal = document.getElementById('menuModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModal = document.querySelector('.close-modal');
    const closeMenuModal = document.querySelector('.close-menu-modal');

    // Открытие модалки бронирования
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.style.display = 'flex';
        });
    });

    // Закрытие модалок
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            bookingModal.style.display = 'none';
        });
    }
    if (closeMenuModal) {
        closeMenuModal.addEventListener('click', () => {
            menuModal.style.display = 'none';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.style.display = 'none';
        if (e.target === menuModal) menuModal.style.display = 'none';
    });

    // Клик по карточкам меню (данные из БД)
    const menuCards = document.querySelectorAll('.menu-card');
    const modalMenuTitle = document.getElementById('modalMenuTitle');
    const modalMenuContent = document.getElementById('modalMenuContent');

    menuCards.forEach(card => {
        card.addEventListener('click', async () => {
            const category = card.getAttribute('data-category');
            modalMenuTitle.textContent = card.querySelector('h3').textContent;
            modalMenuContent.innerHTML = '';
            menuModal.style.display = 'flex';

            try {
                const res = await fetch('api/menu.php?category=' + encodeURIComponent(category));
                const items = await res.json();
                items.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'modal-menu-item';
                    const n = document.createElement('span');
                    n.textContent = item.name;
                    const p = document.createElement('span');
                    p.textContent = item.price + ' ₽';
                    row.append(n, p);
                    modalMenuContent.appendChild(row);
                });
            } catch (e) {
                modalMenuContent.textContent = 'Не удалось загрузить меню';
            }
        });
    });

    // Отправка броней в БД
    async function sendBooking(form) {
        const res = await fetch('api/book.php', { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка отправки');
    }

    const bookingForm = document.getElementById('bookingForm');
    const modalBookingForm = document.getElementById('modalBookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await sendBooking(bookingForm);
                alert('Спасибо! Ваш запрос на бронирование принят. Мы свяжемся с вами в ближайшее время.');
                bookingForm.reset();
            } catch (err) { alert(err.message); }
        });
    }

    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await sendBooking(modalBookingForm);
                alert('Заявка отправлена! Ждем вас в «Капуцин».');
                modalBookingForm.reset();
                bookingModal.style.display = 'none';
            } catch (err) { alert(err.message); }
        });
    }
});
