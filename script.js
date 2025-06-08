// =================================================================
// SCRIPT.JS - «ЧИСТАЯ АРХИТЕКТУРА» ЦИТАДЕЛИ АКАДЕМИИ v3.0
// =================================================================

document.addEventListener('DOMContentLoaded', function() {

    const TELEGRAM_REDIRECT_URL = 'https://web.tribute.tg/s/vFt';

    // -----------------------------------------------------------------
    // Раздел I: Вспомогательные функции
    // -----------------------------------------------------------------

    function setContent(selector, content, isHtml = false) {
        const element = document.querySelector(selector);
        if (element) {
            isHtml ? element.innerHTML = content : element.textContent = content;
        }
    }

    function generateList(selector, items, renderFunction) {
        const container = document.querySelector(selector);
        if (container && Array.isArray(items)) {
            container.innerHTML = items.map(renderFunction).join('');
        }
    }

    // -----------------------------------------------------------------
    // Раздел II: Загрузка и рендер основного контента
    // -----------------------------------------------------------------

    function populateContent(data) {
        document.title = data.siteTitle;
        setContent('#logo', data.logoText);

        const navLinksContainer = document.getElementById('nav-links');
        if (navLinksContainer) {
            navLinksContainer.innerHTML = `
                <a href="#hero">${data.nav.home}</a>
                <a href="#process">${data.nav.process}</a>
                <a href="#author">${data.nav.author}</a>
                <a href="#pricing">${data.nav.pricing}</a>
            `;
        }

        setContent('#hero-title', data.hero.title, true);
        setContent('#hero-subtitle', data.hero.subtitle, true);
        setContent('#hero-cta', data.hero.cta, true);

        // Рендер карточек с проблемами, используя иконки из JSON
        setContent('#problems-title', data.problems.title, true);
        generateList('#problems-grid', data.problems.cards, card => `
            <div class="problem-card">
                <span class="icon material-symbols-outlined">${card.icon}</span>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
            </div>
        `);

        // Рендер преимуществ с иконками из JSON
        setContent('#solution-title', data.solution.title, true);
        setContent('#solution-text-p', data.solution.text);
        generateList('#solution-features', data.solution.features, feature => `
            <div class="feature-item">
                <span class="icon material-symbols-outlined">${feature.icon}</span>
                <div>
                    <h4>${feature.title}</h4>
                    <p>${feature.text}</p>
                </div>
            </div>
        `);
        
        setContent('#process-title', data.process.title, true);
        generateList('#process-steps', data.process.steps, step => `
            <div class="process-step">
                <div class="step-id">${step.id}</div>
                <h3>${step.title}</h3>
                <p>${step.text}</p>
            </div>
        `);

        setContent('#author-title', data.author.title);
        setContent('#author-name', data.author.name);
        setContent('#author-bio', data.author.bio);

        setContent('#testimonials-title', data.testimonials.title, true);
        generateList('#testimonials-grid', data.testimonials.reviews, review => `
            <div class="testimonial-card">
                <p>"${review.text}"</p>
                <div class="testimonial-author-info">
                    <img src="${review.image}" alt="Фото ${review.author}">
                    <div>
                        <div class="testimonial-author-name">${review.author}</div>
                        <span>${review.info}</span>
                    </div>
                </div>
            </div>
        `);

        // Рендер тарифов с иконкой "check"
        setContent('#pricing-title', data.pricing.title, true);
        generateList('#pricing-grid', data.pricing.plans, plan => `
            <div class="pricing-plan ${plan.isPopular ? 'popular' : ''}">
                <h3 class="plan-name">${plan.name}</h3>
                <div class="plan-price">${plan.price}</div>
                <ul class="plan-features">
                    ${plan.features.map(f => `<li><span class="material-symbols-outlined">check</span>${f}</li>`).join('')}
                </ul>
                <a href="#" class="cta-button register-trigger">${plan.cta}</a>
            </div>
        `);
        
        setContent('#faq-title', data.faq.title, true);
        generateList('#faq-container', data.faq.items, item => `
            <div class="faq-item">
                <button class="faq-question">
                    <span>${item.question}</span>
                    <span class="faq-arrow material-symbols-outlined">expand_more</span>
                </button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `);
        
        setContent('#final-cta-title', data.final_cta.title, true);
        setContent('#final-cta-subtitle', data.final_cta.subtitle);
        setContent('#final-cta-button', data.final_cta.cta, true);
        
        setContent('#footer-text', `© ${new Date().getFullYear()} ${data.logoText}. Все права защищены.`);

        initializeDynamicElements(); // <-- ЭТОТ ВЫЗОВ ОСТАВЛЯЕМ
    }

    fetch('content.json')
        .then(response => response.json())
        .then(data => populateContent(data))
        .catch(error => console.error('Ошибка загрузки контента:', error));

    // -----------------------------------------------------------------
    // Раздел III: Динамические элементы и UX
    // -----------------------------------------------------------------

    function initializeDynamicElements() {
        // --- Логика FAQ ---
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });

        // --- Логика чата "Роки" ---
        const rockyChat = document.getElementById('rocky-chat');
        const toggleBtn = document.getElementById('rocky-chat-toggle');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');

        toggleBtn.addEventListener('click', () => {
            rockyChat.classList.toggle('chat--open');
        });

        function addMessage(text, type) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${type}-message`;
            msgDiv.innerHTML = `<p>${text}</p>`;
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        async function handleSend(e) {
            e.preventDefault();
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;
            addMessage(userMessage, 'user');
            chatInput.value = '';
            
            addMessage('Анализирую ваш вопрос...', 'bot loading');
            setTimeout(() => {
                const loading = messagesContainer.querySelector('.loading-message');
                if (loading) loading.remove();
                addMessage('К сожалению, мой нейронный контур сейчас на перезагрузке. Попробуйте спросить позже!', 'bot error');
            }, 2000);
        }

        chatForm.addEventListener('submit', handleSend);
        setTimeout(() => addMessage('Здравствуйте! Я — Роки. Чем могу помочь?', 'bot'), 1000);

        // --- Логика бургерного меню ---
        const burgerMenuButton = document.getElementById('burgerMenu');
        const navLinks = document.getElementById('nav-links');
        const navBar = document.getElementById('navbar'); // Получаем основной навигационный блок
        const navItems = navLinks.querySelectorAll('a'); // Получаем все ссылки внутри меню

        if (burgerMenuButton && navLinks && navBar) {
            burgerMenuButton.addEventListener('click', () => {
                navLinks.classList.toggle('nav-links--open'); // Переключаем класс для показа/скрытия контейнера ссылок
                navBar.classList.toggle('nav--open'); // Переключаем класс для изменения стилей навигации (например, для фона)

                // Добавляем или удаляем класс 'animated' для каждого пункта с задержкой
                navItems.forEach((item, index) => {
                    if (navLinks.classList.contains('nav-links--open')) {
                        // Если меню открывается, добавляем класс с задержкой
                        item.style.animationDelay = `${index * 0.1}s`; // Задержка 0.1s для каждого следующего пункта
                        item.classList.add('animated'); // Добавляем класс для активации анимации
                    } else {
                        // Если меню закрывается, удаляем класс сразу
                        item.classList.remove('animated'); // Удаляем класс анимации
                        item.style.animationDelay = ''; // Сбрасываем задержку
                    }
                });
            });
        }


        // --- Логика модального окна регистрации ---
        const modal = document.getElementById('registration-modal');
        const registerTriggers = document.querySelectorAll('.register-trigger');
        const closeModalBtn = document.getElementById('modal-close-btn');

        function openModal() {
            if (modal) modal.classList.add('modal--open');
        }

        function closeModal() {
            if (modal) modal.classList.remove('modal--open');
        }

        registerTriggers.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        }));
        
        if(closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        if(modal) {
            modal.addEventListener('click', (e) => {
                // Закрывать модальное окно только если клик был вне modal-content
                if (e.target === modal) closeModal(); 
            });
        }
    }
});