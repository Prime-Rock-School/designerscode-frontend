// =================================================================
// SCRIPT.JS - «ЧИСТАЯ АРХИТЕКТУРА» ЦИТАДЕЛИ АКАДЕМИИ v5.0 (ФИНАЛ)
// =================================================================

document.addEventListener('DOMContentLoaded', function() {

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
    // Раздел II: Функции рендера и инициализации
    // -----------------------------------------------------------------

    /**
     * Заполняет страницу контентом из JSON-файла.
     * ВАЖНО: Добавляет data-атрибуты для анимаций непосредственно при создании элементов.
     */
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

        setContent('#problems-title', data.problems.title, true);
        generateList('#problems-grid', data.problems.cards, (card, i) => `
            <div class="problem-card" data-aos="fade-up" data-aos-delay="${i * 100}ms">
                <span class="icon material-symbols-outlined">${card.icon}</span>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
            </div>
        `);

        setContent('#solution-title', data.solution.title, true);
        setContent('#solution-text-p', data.solution.text);
        generateList('#solution-features', data.solution.features, (feature, i) => `
            <div class="feature-item" data-aos="fade-in-left" data-aos-delay="${i * 100}ms">
                <span class="icon material-symbols-outlined">${feature.icon}</span>
                <div>
                    <h4>${feature.title}</h4>
                    <p>${feature.text}</p>
                </div>
            </div>
        `);
        
        setContent('#process-title', data.process.title, true);
        generateList('#process-steps', data.process.steps, (step, i) => `
            <div class="process-step" data-aos="fade-up" data-aos-delay="${i * 100}ms">
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

        setContent('#pricing-title', data.pricing.title, true);
        generateList('#pricing-grid', data.pricing.plans, (plan, i) => `
            <div class="pricing-plan ${plan.isPopular ? 'popular' : ''}" data-aos="fade-scale-up" data-aos-delay="${i * 100}ms">
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
            <div class="faq-item" data-aos="fade-up">
                <button class="faq-question">
                    <span>${item.question}</span>
                    <span class="faq-arrow material-symbols-outlined">expand_more</span>
                </button>
                <div class="faq-answer"><p>${item.answer}</p></div>
            </div>
        `);
        
        setContent('#final-cta-title', data.final_cta.title, true);
        setContent('#final-cta-subtitle', data.final_cta.subtitle);
        setContent('#final-cta-button', data.final_cta.cta, true);
        
        setContent('#footer-text', `© ${new Date().getFullYear()} ${data.logoText}. Все права защищены.`);
    }

    /**
     * Инициализирует анимации появления элементов при прокрутке.
     */
    function initializeAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.aosDelay || '0';
                        entry.target.style.animationDelay = delay;
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => observer.observe(el));
        }
    }

    /**
     * Инициализирует все интерактивные элементы: меню, модальные окна, FAQ и чат.
     */
    function initializeDynamicElements() {
        // --- Логика бургер-меню ---
        const burgerMenuButton = document.getElementById('burgerMenu');
        const navBar = document.getElementById('navbar');
        if (burgerMenuButton && navBar) {
            burgerMenuButton.addEventListener('click', () => {
                navBar.classList.toggle('nav--open');
            });
        }

        // --- Логика FAQ ---
        document.querySelector('#faq-container')?.addEventListener('click', (e) => {
            const questionButton = e.target.closest('.faq-question');
            if (questionButton) {
                questionButton.parentElement.classList.toggle('active');
            }
        });

        // --- Логика модального окна регистрации ---
        const modal = document.getElementById('registration-modal');
        const closeModalBtn = document.getElementById('modal-close-btn');
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.register-trigger')) {
                e.preventDefault();
                modal?.classList.add('modal--open');
            }
        });
        closeModalBtn?.addEventListener('click', () => modal?.classList.remove('modal--open'));
        modal?.addEventListener('click', (e) => (e.target === modal) && modal.classList.remove('modal--open'));
        
        // --- Логика чата "Роки" ---
        const chatContainer = document.getElementById('rocky-chat');
        if (chatContainer) {
            const chatToggleBtn = document.getElementById('rocky-chat-toggle');
            const chatForm = document.getElementById('chat-form');
            const chatMessages = document.getElementById('chat-messages');
            const chatInput = document.getElementById('chat-input');
            const API_ENDPOINT = 'https://designerscode-oracle-backend.onrender.com/api/ask-oracle';

            const addMessage = (text, sender) => {
                const loading = chatMessages.querySelector('.loading-indicator');
                if (loading) loading.remove();
                
                const msgContainer = document.createElement('div');
                msgContainer.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
                const p = document.createElement('p');
                p.textContent = text;
                msgContainer.appendChild(p);
                chatMessages.appendChild(msgContainer);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            const showLoadingIndicator = () => {
                const loadingContainer = document.createElement('div');
                loadingContainer.className = 'chat-message bot-message loading-indicator';
                loadingContainer.innerHTML = `<div class="loader-animation"><span></span><span></span><span></span><span></span></div><p>Ищу ответы в библиотеке Премудрости...</p>`;
                const existingLoading = chatMessages.querySelector('.loading-indicator');
                if (existingLoading) existingLoading.remove();
                chatMessages.appendChild(loadingContainer);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            chatToggleBtn.addEventListener('click', () => {
                chatContainer.classList.toggle('chat--open');
                if (chatContainer.classList.contains('chat--open') && !sessionStorage.getItem('rockyWelcomeShown')) {
                    setTimeout(() => {
                        addMessage('Здравствуйте! Я Роки, ваш проводник. Спросите меня о курсе, тарифах или программе, и я найду ответ в Библиотеке Премудрости.', 'bot');
                        sessionStorage.setItem('rockyWelcomeShown', 'true');
                    }, 500);
                }
            });

            chatContainer.addEventListener('click', (e) => (e.target === chatContainer) && chatContainer.classList.remove('chat--open'));

            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userMessage = chatInput.value.trim();
                if (!userMessage) return;

                addMessage(userMessage, 'user');
                chatInput.value = '';
                showLoadingIndicator();

                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: userMessage }),
                    });
                    if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
                    const data = await response.json();
                    setTimeout(() => addMessage(data.answer || 'Не удалось получить ответ.', 'bot'), 1200);
                } catch (error) {
                    console.error('Rocky: Ошибка связи с ИИ-ассистентом:', error);
                    setTimeout(() => addMessage('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.', 'bot'), 1200);
                }
            });
        }
    }

    // -----------------------------------------------------------------
    // Раздел III: Главная точка входа
    // -----------------------------------------------------------------
    fetch('content.json')
        .then(response => {
            if (!response.ok) throw new Error(`Не удалось загрузить content.json: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // 1. Создаем весь HTML
            populateContent(data);
            
            // 2. Инициализируем всю динамику для созданных элементов
            initializeAnimations();
            initializeDynamicElements();

            console.log("Rocky: Архитектура выстроена. Все системы запущены.");
        })
        .catch(error => console.error('Rocky: Ошибка при возведении цитадели. ', error));
});
